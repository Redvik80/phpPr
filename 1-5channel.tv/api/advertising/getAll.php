<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $resp = pg_fetch_all(pg_query($db, "SELECT * FROM advertising ORDER BY \"order\""));
        $newResp = [];
        foreach($resp as $item) {
            $item["id"] = $item["id"] * 1;
            $item["year"] = $item["year"] * 1;
            $item["order"] = $item["order"] * 1;
            $item["is_block"] = $item["is_block"] === "t" ? true : false;
            array_push($newResp, $item);
        }
        echo json_encode($newResp);
    }
?>