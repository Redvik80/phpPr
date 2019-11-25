<?
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        echo json_encode(pg_fetch_all(pg_query($db, "SELECT * FROM program ORDER BY id")));
    }
?>