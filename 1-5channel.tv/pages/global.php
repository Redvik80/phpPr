<?
    include_once(__DIR__ . "/../utils/logs.php");
    include_once(__DIR__ . "/../utils/file.php");

    $db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");

    function addBanner($banner) {
        $src = getImgSrc($banner["file_name"]);
        $title = $banner['title'];
        echo "
            <a class='banner-container'>
                <img src='${src}' alt='${title}'>
                <div class='banner-title'>${title}</div>
            </a>
        ";
    }
?>