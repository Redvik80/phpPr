<?
    include_once("../common.php");
    include_once("../../utils/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $newData = json_decode(file_get_contents('php://input'), true);
        $oldData = pg_fetch_all(pg_query($db,"SELECT * FROM common_settings"))[0];
        $newData['favicon_file_name'] = $oldData['favicon_file_name'];
        $newData['logo_file_name'] = $oldData['logo_file_name'];
        if (isset($newData["newFavicon"])) {;
            delFile($newData['favicon_file_name'], $imagesDirRoot);
            $newData['favicon_file_name'] = saveFile($newData["newFavicon"]["dataUrl"], $newData["newFavicon"]["extension"], $imagesDirRoot);
        }
        if (isset($newData["newLogo"])) {
            delFile($newData['logo_file_name'], $imagesDirRoot);
            $newData['logo_file_name'] = saveFile($newData["newLogo"]["dataUrl"], $newData["newLogo"]["extension"], $imagesDirRoot);
        }
        pg_query_params($db, 'UPDATE common_settings SET head_title=$1, favicon_file_name=$2, logo_file_name=$3',
            [$newData['head_title'], $newData['favicon_file_name'], $newData['logo_file_name']]
        );
        unset($newData["newFavicon"]);
        unset($newData["newLogo"]);
        echo json_encode($newData);
    }
?>