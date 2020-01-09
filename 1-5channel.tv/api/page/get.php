<?
    include_once("../global.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        checkToken();
        $resp = pg_fetch_all(pg_query($db,
            "SELECT page.id, navigation_name, title, description, ARRAY_TO_JSON(ARRAY_AGG(CONCAT(banner_id, ' ', \"order\"))) as banners " .
            "FROM page LEFT JOIN banner_page_relation ON banner_page_relation.page_id = page.id " .
            "GROUP BY page.id, navigation_name, title, description ORDER BY page.id"
        ));

        $newResp = [];
        foreach($resp as $item) {
            $item["id"] = $item["id"] * 1;
            if ($item["banners"] === "[\" \"]") {
                $item["banners"] = [];
            } else {
                $item["banners"] = json_decode($item["banners"]);
                $newBanners = [];
                foreach($item["banners"] as $banner) {
                    $strArr = explode(" ", $banner, 2);
                    array_push($newBanners, ["id" => $strArr[0] * 1, "order" => $strArr[1] * 1]);
                }
                $item["banners"] = $newBanners;
            }
            array_push($newResp, $item);
        };
        echo json_encode($newResp);
    }
?>