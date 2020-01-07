<?
    function myErrorHandler($errTypeCode, $errStr, $fileName, $fileRow) {
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

    function addErrorToLog($err) {
        $fp = fopen('../../logs.txt', 'a');
        fwrite($fp, "ERROR: " . $err->getMessage() . "\n\t" . $err->getFile() . ":" . $err->getLine() . " (". date("m.d.y H:i:s") . ")\n\n");
        fclose($fp);
    }

    function checkToken() {
        global $db;
        try {
            $headers = getallheaders();
            if (!isset($headers['Authorization']) || !$headers['Authorization']) throw new Exception('Missing Authorization header');
            $tokenArr = explode(".", $headers['Authorization'], 2);
            $tokenIsInvalid = !pg_fetch_result(pg_query_params(
                $db,
                "SELECT id FROM \"user\" WHERE id=$1 AND token=$2",
                [$tokenArr[0] * 1, $tokenArr[1]]
            ), 0, 0);
            if ($tokenIsInvalid) {
                throw new Exception('Token is invalid');
            }
        }
        catch (Exception $err) {
            addErrorToLog($err);
            http_response_code(401);
            die();
        }
    }
?>