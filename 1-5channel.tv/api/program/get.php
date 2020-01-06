<?
    include_once("../common.php");
    function get() {
        global $db;
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') return "[]";

        $resp = [
            "totalQuantity" => 0,
            "data" => []
        ];
        if (isset($_GET['cuted'])) {
            $resp["data"] = pg_fetch_all(pg_query($db, "SELECT id, name, duration FROM program ORDER BY id"));
        } else {
            $resp["data"] = pg_fetch_all(pg_query($db, "SELECT * FROM program ORDER BY id"));
        }
        $newData = [];
        foreach($resp["data"] as $item) {
            $item["id"] = $item["id"] * 1;
            $item["duration"] = $item["duration"] * 1;
            if (isset($item["from_youtube"])) $item["from_youtube"] = $item["from_youtube"] === "t";
            array_push($newData, $item);
        }
        $resp["data"] = $newData;

        $resp["totalQuantity"] = count($resp["data"]);
        $findStr = mb_strtolower($_GET['find_str']);
        if (mb_strlen($findStr) === 0) {
            if (isset(($_GET['page']))) {
                $resp["data"] = array_slice($resp["data"], ($_GET['page'] * 1 - 1) * 10, 10);
                return json_encode($resp);
            } else {
                return json_encode($resp);
            }
        }

        function f1($str) {
            return mb_strlen($str) > 1;
        }
        $words = array_filter(preg_split("/[\s,-.\/]+/", $findStr), "f1");
        if (count($words) === 0) {
            return json_encode([
                "totalQuantity" => 0,
                "data" => []
            ]);
        }

        $newData = [];
        foreach($resp["data"] as $item) {
            $programName = mb_strtolower($item["name"]);
            $isValid = TRUE;
            foreach($words as $word) {
                if (strrpos($programName, $word) === FALSE) {
                    $isValid = FALSE;
                    break;
                }
            }
            if ($isValid) array_push($newData, $item);
        }
        $resp["data"] = $newData;
        $resp["totalQuantity"] = count($resp["data"]);
        if (isset(($_GET['page']))) {
            $resp["data"] = array_slice($resp["data"], ($_GET['page'] * 1 - 1) * 10, 10);
        }
        return json_encode($resp);

    }
    echo get();
?>