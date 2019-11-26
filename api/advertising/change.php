<?
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $data = json_decode(file_get_contents('php://input'), true);

        $oldOrder = pg_fetch_result(
            pg_query_params($db, 'SELECT "order" FROM advertising WHERE id=$1', [$data['id']])
            , 0, 0
        ) * 1;
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

        pg_query_params($db, 'UPDATE advertising SET name=$1, description=$2, year=$3, img_file_name=$4, is_block=$5, "order"=$6 WHERE id=$7',
            [$data['name'], $data['description'], $data['year'], $data['img_file_name'], $data['is_block'] ? "TRUE" : "FALSE", $data['order'], $data['id']]
        );
    }
?>