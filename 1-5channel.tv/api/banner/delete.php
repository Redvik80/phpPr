<?
    include_once("../common.php");
    include_once("../../utils/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $oldFileName = pg_fetch_result(pg_query_params($db, "SELECT file_name FROM banner WHERE id=$1", [$_GET['id'] * 1]), 0, 0);
        delFile($oldFileName, $imagesDirRoot);
        pg_query_params($db, "DELETE FROM banner WHERE id=$1", [$_GET['id'] * 1]);
    }
?>