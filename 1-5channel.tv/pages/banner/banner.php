<html>

<head>
    <?
        include_once("../global.php");
        include_once("../../components/commonSettings/commonSettings.php");
    ?>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />
    <link rel="stylesheet" href="/dist/banner.css">
    <script src="/dist/banner.js" defer></script>
</head>

<body>
    <?
        include "../../components/header/header.php";
        $urlArr = explode("/", $_SERVER['REQUEST_URI']);
        $bannerId = end($urlArr);
        $banner = pg_fetch_all(pg_query_params($db, "SELECT * FROM banner WHERE id = $1", [$bannerId]))[0];
    ?>

    <div class="content">
        <img src='<?=getImgSrc($banner["file_name"]); ?>' alt='<?=$banner["title"]; ?>'>
        <div class="text-content">
            <h1 class='page-text-title'><?=$banner["title"]; ?></h1>
            <div class='page-text-description quill-editor-content'><?=$banner["description"]; ?></div>
        </div>
    </div>
</body>

</html>