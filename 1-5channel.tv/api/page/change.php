<?
    include_once("../global.php");
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        checkToken();
        $pages = json_decode(file_get_contents('php://input'), true);
        foreach($pages as $page) {
            pg_query_params($db, 'UPDATE page SET navigation_name=$1, title=$2, description=$3 WHERE id=$4',
                [$page['navigation_name'], $page['title'], $page['description'], $page['id']]
            );

            $oldRelations = pg_fetch_all(pg_query_params($db, 'SELECT * FROM banner_page_relation WHERE page_id=$1', [$page['id']]));
            if (!$oldRelations) $oldRelations = [];
            foreach($oldRelations as $rel) {
                $bannerIsDel = TRUE;
                foreach($page['banners'] as $banner) {
                    if ($banner["id"] === $rel["banner_id"] * 1) $bannerIsDel = FALSE;
                }
                if ($bannerIsDel) {
                    pg_query_params($db, "DELETE FROM banner_page_relation WHERE id=$1", [$rel["id"] * 1]);
                }
            }
            foreach($page['banners'] as $banner) {
                $isNew = TRUE;
                foreach($oldRelations as $rel) {
                    if ($rel["banner_id"] * 1 === $banner["id"]) $isNew = FALSE;
                }
                if ($isNew) {
                    pg_query_params($db, "INSERT INTO banner_page_relation VALUES(DEFAULT, $1, $2, $3)",[$banner["id"], $page['id'], $banner["order"]]);
                } else {
                    pg_query_params($db, "UPDATE banner_page_relation SET \"order\"=$3 WHERE banner_id=$1 AND page_id=$2", [$banner["id"], $page['id'], $banner["order"]]);
                }
            }
        }
    }
?>