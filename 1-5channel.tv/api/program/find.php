<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $resp = pg_fetch_all(pg_query($db, "SELECT * FROM program ORDER BY id"));

        $findStr = $_GET['find_str'];
        function f1($str) {
            return mb_strlen($str) > 1;
        }
        $words = array_filter(preg_split("/[\s,-.\/]+/", $findStr), "f1");

        if (count($words) > 0) {
            function f2($record) {
                global $words;
                foreach($words as $word) {
                    if (strrpos($record["name"], $word) === FALSE) {
                        return FALSE;
                    }
                }
                return TRUE;
            }
            $resp = array_filter($resp, "f2");
        }

        $newResp = [];
        foreach($resp as $item) {
            $item["id"] = $item["id"] * 1;
            $item["duration"] = $item["duration"] * 1;
            array_push($newResp, $item);
        }
        echo json_encode($newResp);
    }
?>