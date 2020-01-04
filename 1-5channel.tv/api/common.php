<?
    function myErrorHandler ($errTypeCode, $errStr, $fileName, $fileRow) {
        $fp = fopen('../../logs.txt', 'a');
        fwrite($fp, $errStr . "   (" . $fileName . ":" . $fileRow . ") (". date("m.d.y H:i:s") . ")\n");
    }
    set_error_handler("myErrorHandler");

    $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");

    function normalizePrograms($programs) {
        $newArr = [];
        foreach($programs as $item) {
            $item["id"] = $item["id"] * 1;
            $item["duration"] = $item["duration"] * 1;
            $item["from_youtube"] = $item["from_youtube"] === "t";
            array_push($newArr, $item);
        }
        return $newArr;
    }
?>