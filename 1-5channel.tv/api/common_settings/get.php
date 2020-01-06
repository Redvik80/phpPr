<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $resp = pg_fetch_all(pg_query($db,"SELECT * FROM common_settings"));
        echo json_encode($resp[0]);
    }
?>