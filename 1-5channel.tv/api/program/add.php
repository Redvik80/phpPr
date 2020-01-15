<?
    include_once("../global.php");
    include_once("../../utils/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        checkToken();
        $data = json_decode($_POST["data"], true);
        $data['file_name'] = "";
        if (!$data['from_youtube'] && $_FILES["file"]["tmp_name"]) {
            $data['youtube_id'] = "";
            $nameArr = explode(".", $_FILES["file"]["name"]);
            $data['file_name'] = uniqid() . "." . end($nameArr);
            move_uploaded_file($_FILES["file"]["tmp_name"], $videosDirRoot . $data['file_name']);
        }
        pg_query_params($db, "INSERT INTO program VALUES(DEFAULT, $1, $2, $3, $4, $5)",
            [$data['name'], $data['duration'], $data['file_name'], $data['youtube_id'], $data['from_youtube'] ? 1 : 0]
        );
    }
    die();
?>