<?
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");

        $deletingRowData = pg_query_params($db, "SELECT \"order\", \"date\" FROM scheldule WHERE id=$1", [$_GET['id']]);
        $deletingRowOrder = pg_fetch_result($deletingRowData, 0, 0) * 1;
        $deletingRowDate = pg_fetch_result($deletingRowData, 0, 1) * 1;

        pg_query_params($db, "DELETE FROM scheldule WHERE id=$1", [$_GET['id']]);
        pg_query_params($db, "UPDATE scheldule SET \"order\"=\"order\"-1 WHERE \"date\"=$1 AND \"order\">$2", [$deletingRowDate, $deletingRowOrder]);
    }
?>