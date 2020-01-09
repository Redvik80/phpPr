<?
    function myErrorHandler($errTypeCode, $errStr, $fileName, $fileRow) {
        $fp = fopen(__DIR__ . '/../logs.txt', 'a');
        fwrite($fp, "ERROR: " . $errStr . "\n\t" . $fileName . ":" . $fileRow . " (". date("m.d.y H:i:s") . ")\n\n");
        fclose($fp);
        http_response_code(500);
        die();
    }

    function fileLog($data) {
        $fp = fopen(__DIR__ . '/../logs.txt', 'a');
        fwrite($fp, json_encode($data) . "\n");
        fclose($fp);
    }

    function addErrorToLog($err) {
        $fp = fopen(__DIR__ . '/../logs.txt', 'a');
        fwrite($fp, "ERROR: " . $err->getMessage() . "\n\t" . $err->getFile() . ":" . $err->getLine() . " (". date("m.d.y H:i:s") . ")\n\n");
        fclose($fp);
    }
?>