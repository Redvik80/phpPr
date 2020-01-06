<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $resp = pg_fetch_all(pg_query_params($db,
            "SELECT * " .
            "FROM scheldule INNER JOIN program ON scheldule.program_id=program.id " .
            "WHERE \"date\"=$1 ORDER BY \"order\"",
            [$_GET['date'] * 1]
        ));
        $newResp = [];
        foreach($resp as $item) {
            $item["id"] = $item["id"] * 1;
            $item["date"] = $item["date"] * 1;
            $item["order"] = $item["order"] * 1;
            $item["program"] = [
                "id" => $item["program_id"] * 1,
                "name" => $item["name"],
                "duration" => $item["duration"] * 1
            ];
            unset($item["youtube_id"]);
            unset($item["from_youtube"]);
            unset($item["file_name"]);
            unset($item["name"]);
            unset($item["duration"]);
            unset($item["program_id"]);
            array_push($newResp, $item);
        };
        echo json_encode($newResp);
    }
?>