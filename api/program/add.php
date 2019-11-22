<?
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $data = json_decode(file_get_contents('php://input'), true);
        echo pg_fetch_result(pg_query_params($db, "INSERT INTO tv_program VALUES(DEFAULT, $1, $2) RETURNING id",
            [$data['program_name'], $data['duration']]
        ), 0, 0);
    }
?>