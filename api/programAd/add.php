<?
    include("../../utils/php/file.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data['new_img_file']) {
            delImage($data['img_file_name']);
            $data['img_file_name'] = saveImage($data['new_img_file']);
        }
        echo pg_fetch_result(pg_query_params($db, "INSERT INTO tv_program_ad VALUES(DEFAULT, $1, $2, $3, $4, $5) RETURNING id",
            [$data['name'], $data['description'], $data['year'], $data['img_file_name'], $data['order']]
        ), 0, 0);
    }
?>