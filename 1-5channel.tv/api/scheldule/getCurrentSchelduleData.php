<?
    include_once("../global.php");
    date_default_timezone_set("UTC");
    $date = strtotime("today");
    $dateTime = time();

    $pograms = pg_fetch_all(pg_query_params($db,
        "SELECT program.id as id, name, duration, file_name, youtube_id, from_youtube " .
        "FROM scheldule INNER JOIN program ON scheldule.program_id=program.id " .
        "WHERE \"date\"=$1 ORDER BY \"order\"",
        [$date]
    ));
    if (!$pograms) $pograms = [];

    $time = [
        "timestamp" => $date,
        "hours" => 0,
        "minutes" => 0,
        "seconds" => 0
    ];
    $currentProgram = null;
    $nextProgram = null;
    foreach ($pograms as $program) {
        $startTime = [
            "timestamp" => $time["timestamp"],
            "hours" => $time["hours"],
            "minutes" => $time["minutes"],
            "seconds" => $time["seconds"]
        ];
        $startTimeStr = ($time["hours"] < 10 ? "0" : "") . $time["hours"] . ":" .
            ($time["minutes"] < 10 ? "0" : "") . $time["minutes"] . ":" .
            ($time["seconds"] < 10 ? "0" : "") . $time["seconds"];
        $time["timestamp"] += $program["duration"];
        $time["seconds"] += $program["duration"];
        $time["minutes"] += floor($time["seconds"] / 60);
        $time["seconds"] = $time["seconds"] % 60;
        $time["hours"] += floor($time["minutes"] / 60);
        $time["minutes"] = $time["minutes"] % 60;
        if (($time["hours"] == 24 && ($time["minutes"] > 0 || $time["seconds"] > 0)) || $time["hours"] > 24) break;
        $endTime = [
            "timestamp" => $time["timestamp"],
            "hours" => $time["hours"],
            "minutes" => $time["minutes"],
            "seconds" => $time["seconds"]
        ];
        $endTimeStr = ($time["hours"] < 10 ? "0" : "") . $time["hours"] . ":" .
            ($time["minutes"] < 10 ? "0" : "") . $time["minutes"] . ":" .
            ($time["seconds"] < 10 ? "0" : "") . $time["seconds"];

        if ($currentProgram) {
            $program["id"] = $program["id"] * 1;
            $program["duration"] = $program["duration"] * 1;
            $program["from_youtube"] = $program["from_youtube"] === "t";
            $nextProgram = [
                "program" => $program,
                "startTime" => $startTime,
                "endTime" => $endTime
            ];
            break;
        }
        if ($dateTime > $startTime["timestamp"] && $dateTime < $endTime["timestamp"]) {
            $program["id"] = $program["id"] * 1;
            $program["duration"] = $program["duration"] * 1;
            $program["from_youtube"] = $program["from_youtube"] === "t";
            $currentProgram = [
                "program" => $program,
                "startTime" => $startTime,
                "endTime" => $endTime
            ];
            continue;
        }
    }

    echo json_encode([
        "currentProgram" => $currentProgram,
        "nextProgram" => $nextProgram
    ]);
?>