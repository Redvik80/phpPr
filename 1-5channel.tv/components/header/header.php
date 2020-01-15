<header>
    <img src="<?=$logo?>" alt="logo" class="logo">
    <?
        $pagesNames = pg_fetch_all(pg_query($db, "SELECT navigation_name FROM page ORDER BY id"));
    ?>
    <nav class="page-navigation">
        <?
            $links = [
                ["url" => "/", "name" => $pagesNames[0]["navigation_name"]],
                ["url" => "/programTV", "name" => $pagesNames[1]["navigation_name"]],
                ["url" => "/onlineTV", "name" => $pagesNames[2]["navigation_name"]]
            ];
            foreach($links as $link) {
                $requestUrlArr = explode("?", $_SERVER['REQUEST_URI'], 2);
                $requestUrl = count($requestUrlArr) > 0 ? $requestUrlArr[0] : $_SERVER['REQUEST_URI'];
                $class = $requestUrl === $link["url"] ? "class='selected'" : "";
                $href =  $link["url"];
                $text = $link["name"];
                echo "<a ${class} href='${href}'>${text}</a>";
            }
        ?>
    </nav>
</header>