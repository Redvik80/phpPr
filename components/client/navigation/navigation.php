<nav id="page-navigation">
    <?
        $links = [
            ["url" => "/", "name" => "Главная"],
            ["url" => "/pages/client/programTV/programTV.php", "name" => "Программа TV"],
            ["url" => "/pages/client/onlineTV/onlineTV.php", "name" => "Прямой эфир"]
        ];
        foreach($links as $link) {
            echo sprintf(
                "<a %s href='%s'>%s</a>",
                $_SERVER['REQUEST_URI'] === $link["url"] ? "class='selected'" : "",
                $link["url"],
                $link["name"]
            );
        }
    ?>
</nav>