<html>

<head>
    <title>1.5 канал</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />
    <link rel="stylesheet" href="/dist/programTV.css">
    <script src="/dist/programTV.js" defer></script>
</head>

<body>
    <?
        include_once("../global.php");
        include "../../components/header/header.php";
        $pageId = 2;
        $pageText = pg_fetch_all(pg_query($db, "SELECT title, description FROM page WHERE id = ${pageId}"))[0];
        $banners = pg_fetch_all(pg_query($db, "
            SELECT banner.id, title, file_name
            FROM banner INNER JOIN banner_page_relation ON banner_page_relation.banner_id = banner.id
            WHERE banner_page_relation.page_id = ${pageId} ORDER BY banner_page_relation.order"
        ));
        if (!$banners[0]) $banners = [];
    ?>

    <div class="content">
        <aside class="banners-aside">
            <?
                if (count($banners) > 0) addBanner($banners[0]);
                if (count($banners) > 1) addBanner($banners[1]);
                if (count($banners) > 2) addBanner($banners[2]);
            ?>
        </aside>
        <div class="text-and-table-container">
            <div class="text-content">
                <?
                    echo "
                        <h1 class='page-text-title'>${pageText['title']}</h1>
                        <div class='page-text-description quill-editor-content'>${pageText['description']}</div>
                    ";
                ?>
            </div>
            <div class="table">
                <div class="table-header">
                    <?
                        $date = isset($_GET['date']) ? $_GET['date'] * 1 : strtotime("today 00:00 UTC");
                    ?>
                    <div class="time-cell">Время</div>
                    <div class="name-cell">Телепередача</div>
                    <?include "../../components/clock/clock.php";?>
                    <input type="date" value="<? echo date("Y-m-d", $date); ?>">
                </div>
                <div class="table-body">
                    <?
                        $pograms = pg_fetch_all(pg_query_params($db,
                            "SELECT program.name, program.duration " .
                            "FROM scheldule INNER JOIN program ON scheldule.program_id=program.id " .
                            "WHERE \"date\"=$1 ORDER BY \"order\"",
                            [$date]
                        ));
                        if (!$pograms[0]) $pograms = [];
                        $time = [
                            "hours" => 0,
                            "minutes" => 0,
                            "seconds" => 0
                        ];
                        foreach ($pograms as $program) {
                            $timeStr = ($time["hours"] < 10 ? "0" : "") . $time["hours"] . ":" .
                                ($time["minutes"] < 10 ? "0" : "") . $time["minutes"] . ":" .
                                ($time["seconds"] < 10 ? "0" : "") . $time["seconds"];
                            $time["seconds"] += $program["duration"];
                            $time["minutes"] += floor($time["seconds"] / 60);
                            $time["seconds"] = $time["seconds"] % 60;
                            $time["hours"] += floor($time["minutes"] / 60);
                            $time["minutes"] = $time["minutes"] % 60;
                            if (($time["hours"] == 24 && ($time["minutes"] > 0 || $time["seconds"] > 0)) || $time["hours"] > 24) break;
                    ?>
                        <div class="table-row">
                            <div class="time-cell"><? echo $timeStr; ?></div>
                            <div class="name-cell"><? echo $program["name"]; ?></div>
                        </div>
                    <?}?>
                </div>
            </div>
        </div>
        <aside class="banners-aside">
            <?
                if (count($banners) > 3) addBanner($banners[3]);
                if (count($banners) > 4) addBanner($banners[4]);
                if (count($banners) > 5) addBanner($banners[5]);
            ?>
        </aside>
        <div class="banners-footer">
            <?
                if (count($banners) > 6) foreach($banners as $banner) addBanner($banner);
            ?>
        </div>
    </div>
</body>

</html>