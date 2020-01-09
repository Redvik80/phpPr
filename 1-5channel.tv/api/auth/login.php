<?
    include_once("../global.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $user = pg_fetch_all(pg_query_params(
                $db, "SELECT id, passhash FROM \"user\" WHERE login=$1", [$data["login"]]
            ))[0];
            if (!$user) throw new Exception('User not found');
            $passwordIsValid = password_verify($data["password"], $user["passhash"]);
            if (!$passwordIsValid) throw new Exception('Invalid password');
            $token = uniqid();
            pg_query_params($db, "UPDATE \"user\" SET token=$1 WHERE id=$2", [$token, $user['id']]);
            echo json_encode($user["id"] . "." . $token);
        }
        catch (Exception $err) {
            addErrorToLog($err);
            http_response_code(403);
            die();
        }
    }
?>