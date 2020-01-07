<?
    include_once("../common.php");
    include_once("../../utils/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        checkToken();
        $data = json_decode(file_get_contents('php://input'), true);
        $data['file_name'] = "";
        if (isset($data["newFile"])) {
            $data['file_name'] = saveFile($data["newFile"]["dataUrl"], $data["newFile"]["extension"], $videosDirRoot);
        }
        pg_query_params($db, "INSERT INTO program VALUES(DEFAULT, $1, $2, $3, $4, $5)",
            [$data['name'], $data['duration'], $data['file_name'], $data['youtube_id'], $data['from_youtube'] ? 1 : 0]
        );
    }
?>