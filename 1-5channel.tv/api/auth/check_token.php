<?
    include_once("../global.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        checkToken();
        echo json_encode("Success");
    }
?>