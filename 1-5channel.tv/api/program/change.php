<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        pg_query_params($db, "UPDATE program SET name=$1, duration=$2, link=$3 WHERE id=$4",
            [$data['name'], $data['duration'], $data['link'], $data['id']]
        );
    }
?>