<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        checkToken();
        echo json_encode("Success");
    }
?>