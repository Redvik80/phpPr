<?
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $deletingRowOrder = pg_fetch_result(
            pg_query_params($db, "SELECT \"order\" FROM advertising WHERE id=$1", [$_GET['id']])
            , 0, 0
        );
        pg_query_params($db, "DELETE FROM advertising WHERE id=$1", [$_GET['id']]);
        pg_query_params($db, "UPDATE advertising SET \"order\"=\"order\" - 1 WHERE \"order\" > $1", [$deletingRowOrder]);
    }
?>