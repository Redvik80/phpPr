<?
    include_once("../common.php");
    include_once("../../utils/php/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        $oldData = pg_query_params($db, 'SELECT "order", img_file_name FROM advertising WHERE id=$1', [$data['id']]);
        $oldOrder = pg_fetch_result($oldData, 0, 0) * 1;
        $data['img_file_name'] = pg_fetch_result($oldData, 0, 1);

        $newOrder = $data['order'];
        if ($newOrder > $oldOrder) {
            pg_query_params(
                $db,
                "UPDATE advertising SET \"order\"=\"order\" - 1 WHERE \"order\" > $1 AND \"order\" <= $2",
                [$oldOrder, $newOrder]
            );
        } else if ($newOrder < $oldOrder) {
            pg_query_params(
                $db,
                "UPDATE advertising SET \"order\"=\"order\" + 1 WHERE \"order\" < $1 AND \"order\" >= $2",
                [$oldOrder, $newOrder]
            );
        }



        if ($data['newImg']) {
            delImage($data['img_file_name']);
            $data['img_file_name'] = saveImage($data['newImg']);
        }

        pg_query_params($db, 'UPDATE advertising SET name=$1, description=$2, year=$3, img_file_name=$4, is_block=$5, "order"=$6 WHERE id=$7',
            [$data['name'], $data['description'], $data['year'], $data['img_file_name'], $data['is_block'] ? "TRUE" : "FALSE", $data['order'], $data['id']]
        );
    }
?>