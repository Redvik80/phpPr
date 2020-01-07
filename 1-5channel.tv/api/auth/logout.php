<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        checkToken();
        $userId = explode(".", getallheaders()['Authorization'], 2)[0] * 1;
        fileLog($userId);
        pg_query_params($db, "UPDATE \"user\" SET token=NULL WHERE id=$1" , [$userId]);
    }
?>