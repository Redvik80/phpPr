<?
    include_once("../global.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        checkToken();
        $resp = pg_fetch_all(pg_query($db,"SELECT * FROM common_settings"));
        echo json_encode($resp[0]);
    }
?>