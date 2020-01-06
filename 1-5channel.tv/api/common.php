<?
    function myErrorHandler ($errTypeCode, $errStr, $fileName, $fileRow) {
        $fp = fopen('../../logs.txt', 'a');
        fwrite($fp, "ERROR: " . $errStr . "\n\t" . $fileName . ":" . $fileRow . " (". date("m.d.y H:i:s") . ")\n\n");
        fclose($fp);
        http_response_code(500);
        die();
    }
    set_error_handler("myErrorHandler");

    $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");

    function fileLog($data) {
        $fp = fopen('../../logs.txt', 'a');
        fwrite($fp, json_encode($data) . "\n");
        fclose($fp);
    }
?>