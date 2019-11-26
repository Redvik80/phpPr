<?
    include "../../utils/php/file.php";
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $data = json_decode(file_get_contents('php://input'), true);
        $oldOrder =  pg_fetch_result(
            pg_query($db, 'SELECT count(*) FROM advertising')
            , 0, 0
        ) + 1;
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
            $data['img_file_name'] = saveImage($data['newImg']);
        }
        echo pg_fetch_result(pg_query_params($db, "INSERT INTO advertising VALUES(DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING id",
            [$data['name'], $data['description'], $data['year'], $data['img_file_name'], $data['is_block'] ? "TRUE" : "FALSE", $data['order']]
        ), 0, 0);
    }
?>