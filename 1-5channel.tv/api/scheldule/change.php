<?
    include_once("../common.php");
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        checkToken();
        $newData = json_decode(file_get_contents('php://input'), true);
        for ($i = 0;  $i < count($newData); $i++) {
            if (!$newData[$i]["id"]) {
                $newData[$i]["id"] = pg_fetch_result(pg_query_params($db, 'INSERT INTO scheldule VALUES (DEFAULT, $1, $2, $3) RETURNING id',
                    [$newData[$i]['date'], $newData[$i]['program_id'], $newData[$i]['order']]
                ), 0, 0) * 1;
            } else {
                pg_query_params($db, 'UPDATE scheldule SET "date"=$1, program_id=$2, "order"=$3 WHERE id=$4',
                    [$newData[$i]['date'], $newData[$i]['program_id'], $newData[$i]['order'], $newData[$i]['id']]
                );
            }
        }

        $oldData = pg_fetch_all(pg_query_params($db, 'SELECT id FROM scheldule WHERE "date"=$1', [$_GET['date']]));
        foreach($oldData as $oldItem) {
            $oldItemDelete = true;
            foreach($newData as $newItem) {
                if ($newItem["id"] === $oldItem["id"] * 1) {
                    $oldItemDelete = false;
                }
            }
            if ($oldItemDelete) {
                pg_query_params($db, 'DELETE FROM scheldule WHERE id=$1', [$oldItem["id"]]);
            }
        }
        echo json_encode($newData);
    }
?>