<?
    include_once(__DIR__ . "/../utils/logs.php");

    set_error_handler("myErrorHandler");

    $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");

    function checkToken() {
        global $db;
        try {
            $headers = getallheaders();
            if (!isset($headers['Authorization']) || !$headers['Authorization']) throw new Exception('Missing Authorization header');
            $tokenArr = explode(".", $headers['Authorization'], 2);
            $tokenIsInvalid = pg_fetch_all(pg_query_params(
                $db,
                "SELECT id FROM \"user\" WHERE id=$1 AND token=$2",
                [$tokenArr[0] * 1, $tokenArr[1]]
            ))[0] === NULL;

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