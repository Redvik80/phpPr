<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        pg_query_params($db, "DELETE FROM program WHERE id=$1", [$_GET['id']]);
    }
?>