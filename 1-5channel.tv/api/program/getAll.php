<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $resp = [
            "totalQuantity" => 0,
            "data" => []
        ];
        $resp["data"] = normalizePrograms(pg_fetch_all(pg_query($db, "SELECT * FROM program ORDER BY id")));
        $resp["totalQuantity"] = count($resp["data"]);
        $findStr = mb_strtolower($_GET['find_str']);
        if (mb_strlen($findStr) === 0) {
            $resp["data"] = array_slice($resp["data"], ($_GET['page'] * 1 - 1) * 10, 10);
            echo json_encode($resp);
        } else {
            function f1($str) {
                return mb_strlen($str) > 1;
            }
            $words = array_filter(preg_split("/[\s,-.\/]+/", $findStr), "f1");

            if (count($words) === 0) {
                echo json_encode([
                    "totalQuantity" => 0,
                    "data" => []
                ]);
            } else {
                function f2($record) {
                    global $words;
                    $programName = mb_strtolower($record["name"]);
                    foreach($words as $word) {
                        if (strrpos($programName, $word) === FALSE) {
                            return FALSE;
                        }
                    }
                    return TRUE;
                }
                $resp["data"] = array_filter($resp["data"], "f2");
                $resp["totalQuantity"] = count($resp["data"]);
                $resp["data"] = array_slice($resp["data"], ($_GET['page'] * 1 - 1) * 10, 10);

                echo json_encode($resp);
            }
        }
    }
?>