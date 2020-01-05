<?
    function myErrorHandler ($errTypeCode, $errStr, $fileName, $fileRow) {
        $fp = fopen('../../logs.txt', 'a');
        fwrite($fp, $errStr . "   (" . $fileName . ":" . $fileRow . ") (". date("m.d.y H:i:s") . ")\n");
        http_response_code(500);
        die();
    }
    set_error_handler("myErrorHandler");

    $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
?>