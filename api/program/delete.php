<?
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        pg_query_params($db, "DELETE FROM program WHERE id=$1", [$_GET['id']]);
    }
?>