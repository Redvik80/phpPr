<?
    include_once("../common.php");
    include_once("../../utils/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        checkToken();
        $data = json_decode(file_get_contents('php://input'), true);
        $data['file_name'] = pg_fetch_result(pg_query_params($db, 'SELECT file_name FROM banner WHERE id=$1', [$data['id']]), 0, 0);
        if (isset($data["newFile"])) {
            delFile($data['file_name'], $imagesDirRoot);
            $data['file_name'] = saveFile($data["newFile"]["dataUrl"], $data["newFile"]["extension"], $imagesDirRoot);
        }
        pg_query_params($db, 'UPDATE banner SET title=$2, description=$3, file_name=$4 WHERE id=$1',
            [$data['id'], $data['title'], $data['description'], $data['file_name']]
        );
        unset($data["newFile"]);
        echo json_encode($data);
    }
?>