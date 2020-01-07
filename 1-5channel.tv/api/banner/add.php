<?
    include_once("../common.php");
    include_once("../../utils/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        checkToken();
        $data = json_decode(file_get_contents('php://input'), true);
        $data['file_name'] = "";
        if (isset($data["newFile"])) {
            $data['file_name'] = saveFile($data["newFile"]["dataUrl"], $data["newFile"]["extension"], $imagesDirRoot);
        }
        pg_query_params($db, "INSERT INTO banner VALUES(DEFAULT, $1, $2, $3)",
            [$data['title'], $data['description'], $data['file_name']]
        );
    }
?>