<?
    include_once("../global.php");
    include_once("../../utils/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        checkToken();
        $data = json_decode($_POST["data"], true);
        $data['file_name'] = pg_fetch_result(pg_query_params($db, "SELECT file_name FROM program WHERE id=$1", [$data['id']]), 0, 0);
        if ($data['from_youtube']) {
            delFile($data['file_name'], $videosDirRoot);
            $data['file_name'] = "";
        } else if ($_FILES["file"]["tmp_name"]) {
            $data['youtube_id'] = "";
            delFile($data['file_name'], $videosDirRoot);
            $nameArr = explode(".", $_FILES["file"]["name"]);
            $data['file_name'] = uniqid() . "." . end($nameArr);
            move_uploaded_file($_FILES["file"]["tmp_name"], $videosDirRoot . $data['file_name']);
        }
        pg_query_params($db, "UPDATE program SET name=$2, duration=$3, file_name=$4, youtube_id=$5, from_youtube=$6 WHERE id=$1",
            [$data['id'], $data['name'], $data['duration'], $data['file_name'], $data['youtube_id'], $data['from_youtube'] ? 1 : 0]
        );
        echo json_encode($data);
    }
    die();
?>