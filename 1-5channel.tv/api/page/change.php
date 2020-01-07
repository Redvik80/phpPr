<?
    include_once("../common.php");
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
                if (!in_array($rel["banner_id"] * 1, $page['banners_id'])) {
                    pg_query_params($db, "DELETE FROM banner_page_relation WHERE id=$1", [$rel["id"] * 1]);
                }
            }
            foreach($page['banners_id'] as $bannerId) {
                $isNew = TRUE;
                foreach($oldRelations as $rel) {
                    if ($rel["banner_id"] * 1 === $bannerId) $isNew = FALSE;
                }
                if ($isNew) {
                    pg_query_params($db, "INSERT INTO banner_page_relation VALUES(DEFAULT, $1, $2)",[$bannerId, $page['id']]);
                }
            }
        }
    }
?>