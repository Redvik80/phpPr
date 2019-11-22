<?
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $data = json_decode(file_get_contents('php://input'), true);
        pg_query_params($db, "UPDATE tv_program SET program_name=$1, duration=$2 WHERE id=$3",
            [$data['program_name'], $data['duration'], $data['id']]
        );
    }
?>