<?
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $data = json_decode(file_get_contents('php://input'), true);

        $oldOrder = pg_fetch_result(pg_query_params($db, 'SELECT "order" FROM scheldule WHERE id=$1', [$data['id']]), 0, 0) * 1;

        $newOrder = $data['order'];
        if ($newOrder > $oldOrder) {
            pg_query_params(
                $db,
                "UPDATE scheldule SET \"order\"=\"order\" - 1 WHERE \"date\" = $1 AND \"order\" > $2 AND \"order\" <= $3",
                [$data["date"], $oldOrder, $newOrder]
            );
        } else if ($newOrder < $oldOrder) {
            pg_query_params(
                $db,
                "UPDATE scheldule SET \"order\"=\"order\" + 1 WHERE \"date\" = $1 AND \"order\" < $2 AND \"order\" >= $3",
                [$data["date"], $oldOrder, $newOrder]
            );
        }

        pg_query_params($db, 'UPDATE scheldule SET "date"=$1, program_id=$2, "order"=$3 WHERE id=$4',
            [$data['date'], $data['program_id'], $data['order'], $data['id']]
        );
    }
?>