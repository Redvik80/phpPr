<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        echo pg_fetch_result(pg_query_params($db, "INSERT INTO program VALUES(DEFAULT, $1, $2, $3) RETURNING id",
            [$data['name'], $data['duration'], $data['link']]
        ), 0, 0);
    }
?>