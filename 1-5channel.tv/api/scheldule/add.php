<?
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
        $data = json_decode(file_get_contents('php://input'), true);
        $oldOrder = pg_fetch_result(
            pg_query_params($db, 'SELECT count(*) FROM scheldule WHERE "date" = $1', [$data["date"]])
            , 0, 0
        ) + 1;
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
        echo pg_fetch_result(pg_query_params($db, "INSERT INTO scheldule VALUES(DEFAULT, $1, $2, $3) RETURNING id",
            [$data['date'], $data['program_id'], $data['order']]
        ), 0, 0);
    }
?>