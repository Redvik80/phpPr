<html>

<head>
    <title>1.5 канал</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />
    <link rel="stylesheet" href="/dist/onlineTV.css">

    <script src="https://www.youtube.com/iframe_api" defer></script>
    <script src="/dist/onlineTV.js" defer></script>
</head>

<body>
    <?
        include_once("../global.php");
        include "../../components/header/header.php";
        $pageId = 3;
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
            ?>
        </aside>
        <div class="text-and-player-container">
            <div class="text-content">
                <?
                    echo "
                        <h1 class='page-text-title'>${pageText['title']}</h1>
                        <div class='page-text-description quill-editor-content'>${pageText['description']}</div>
                    ";
                ?>
            </div>
            <div class="player-container">
                <div id="player-header">

                </div>
                <div id="yt-player"></div>
                <video id="html-player" muted></video>
                <img src="/files/images/noSignal.png" alt="no signal" id="no-signal-img">
            </div>
        </div>
        <aside class="banners-aside">
            <?
                if (count($banners) > 2) addBanner($banners[2]);
                if (count($banners) > 3) addBanner($banners[3]);
            ?>
        </aside>
        <div class="banners-footer">
            <?
                if (count($banners) > 4) foreach($banners as $banner) addBanner($banner);
            ?>
        </div>
    </div>
</body>

</html>