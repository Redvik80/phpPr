<?
    include_once("../common.php");
    include_once("../../utils/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        checkToken();
        $data = json_decode(file_get_contents('php://input'), true);
        $data['file_name'] = pg_fetch_result(pg_query_params($db, "SELECT file_name FROM program WHERE id=$1", [$data['id']]), 0, 0);
        if (isset($data["newFile"])) {
            delFile($data['file_name'], $videosDirRoot);
            $data['file_name'] = saveFile($data["newFile"]["dataUrl"], $data["newFile"]["extension"], $videosDirRoot);
        }
        pg_query_params($db, "UPDATE program SET name=$2, duration=$3, file_name=$4, youtube_id=$5, from_youtube=$6 WHERE id=$1",
            [$data['id'], $data['name'], $data['duration'], $data['file_name'], $data['youtube_id'], $data['from_youtube'] ? 1 : 0]
        );
        unset($data["newFile"]);
        echo json_encode($data);
    }
?>