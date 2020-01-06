<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $resp = pg_fetch_all(pg_query($db,
            "SELECT page.id, navigation_name, title, description, ARRAY_TO_JSON(ARRAY_AGG(banner_id)) as banners_id " .
            "FROM page LEFT JOIN banner_page_relation ON banner_page_relation.page_id = page.id " .
            "GROUP BY page.id, navigation_name, title, description ORDER BY page.id"
        ));

        $newResp = [];
        foreach($resp as $item) {
            $item["id"] = $item["id"] * 1;
            if ($item["banners_id"] === "[null]") {
                $item["banners_id"] = [];
            } else {
                $item["banners_id"] = json_decode($item["banners_id"]);
            }
            array_push($newResp, $item);
        };
        echo json_encode($newResp);
    }
?>