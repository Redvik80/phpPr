<?php // php -f setDefaultUsers.php
$db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
pg_query($db, "DELETE FROM \"user\"");
$users = [
    [
        "id" => 153,
        "login" => "001",
        "password" => "001"
    ]
];
foreach($users as $user) {
    pg_query_params($db, "INSERT INTO \"user\" VALUES($1, $2, $3)", [$user['id'], $user['login'], password_hash($user['password'], PASSWORD_DEFAULT)]);
}
