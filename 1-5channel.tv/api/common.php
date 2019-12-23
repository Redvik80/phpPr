<?
    function myErrorHandler ($errTypeCode, $errStr, $fileName, $fileRow) {
        $fp = fopen('../../logs.txt', 'a');
        fwrite($fp, $errStr . "   (" . $fileName . ":" . $fileRow . ") (". date("m.d.y H:i:s") . ")\n");
    }
    set_error_handler("myErrorHandler");

    $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
?>