<?
    include "../../utils/php/file.php";
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");

        $deletingRowData = pg_query_params($db, "SELECT \"order\", img_file_name FROM advertising WHERE id=$1", [$_GET['id']]);
        $deletingRowOrder = pg_fetch_result($deletingRowData, 0, 0);
        $deletingRowImgName = pg_fetch_result($deletingRowData, 0, 1);

        if ($deletingRowImgName) {
            delImage($deletingRowImgName);
        }

        pg_query_params($db, "DELETE FROM advertising WHERE id=$1", [$_GET['id']]);
        pg_query_params($db, "UPDATE advertising SET \"order\"=\"order\" - 1 WHERE \"order\" > $1", [$deletingRowOrder]);
    }
?>