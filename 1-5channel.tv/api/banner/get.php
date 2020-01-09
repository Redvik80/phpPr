<?
    include_once("../global.php");
    function get() {
        global $db;
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') return "[]";
        checkToken();

        $resp = [
            "totalQuantity" => 0,
            "data" => []
        ];
        if (isset($_GET['cuted'])) {
            $resp["data"] = pg_fetch_all(pg_query($db, "SELECT id, title FROM banner ORDER BY id"));
        } else {
            $resp["data"] = pg_fetch_all(pg_query($db, "SELECT * FROM banner ORDER BY id"));
        }

        $newData = [];
        foreach($resp["data"] as $item) {
            $item["id"] = $item["id"] * 1;
            array_push($newData, $item);
        }
        $resp["data"] = $newData;
        $resp["totalQuantity"] = count($resp["data"]);

        if (isset($_GET['find_str'])) {
            $findStr = mb_strtolower($_GET['find_str']);
        }
        if (!isset($_GET['find_str']) || mb_strlen($findStr) === 0) {
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
            $bannerTitle = mb_strtolower($item["title"]);
            $isValid = TRUE;
            foreach($words as $word) {
                if (strrpos($bannerTitle, $word) === FALSE) {
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