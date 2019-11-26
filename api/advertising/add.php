<?
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $data = json_decode(file_get_contents('php://input'), true);
        echo pg_fetch_result(pg_query_params($db, "INSERT INTO advertising VALUES(DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING id",
            [$data['name'], $data['description'], $data['year'], $data['img_file_name'], $data['is_block'] ? "TRUE" : "FALSE", $data['order']]
        ), 0, 0);
    }
?>