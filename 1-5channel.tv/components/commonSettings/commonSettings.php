<?

    function endsWith($str, $substr){
        return substr_compare($str, $substr, -strlen($substr)) === 0;
    }
    $commonSettings = pg_fetch_all(pg_query($db, "SELECT * FROM common_settings"))[0];
    $title = $commonSettings["head_title"];
    $favicon = getImgSrc($commonSettings["favicon_file_name"]);
    $logo = getImgSrc($commonSettings["logo_file_name"]);
    $faviconType = "";
    if (endsWith($commonSettings["favicon_file_name"], ".jpg") || endsWith($commonSettings["favicon_file_name"], ".jpeg")) {
        $faviconType = "image/jpeg";
    } else if (endsWith($commonSettings["favicon_file_name"], ".png")) {
        $faviconType = "image/png";
    } else if (endsWith($commonSettings["favicon_file_name"], ".gif")) {
        $faviconType = "image/gif";
    } else if (endsWith($commonSettings["favicon_file_name"], ".ico")) {
        $faviconType = "image/x-icon";
    }
?>
<title><?=$title?></title>
<link rel="icon" type="<?=$faviconType?>" href="<?=$favicon?>">