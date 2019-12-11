<?
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $resp = pg_fetch_all(pg_query($db, "SELECT * FROM program ORDER BY program"));
        $newResp = [];
        foreach($resp as $item) {
            $item["id"] = $item["id"] * 1;
            $item["duration"] = $item["duration"] * 1;
            array_push($newResp, $item);
        }
        echo json_encode($newResp);
    }
?>