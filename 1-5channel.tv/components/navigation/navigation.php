<nav id="page-navigation">
    <?
        $links = [
            ["url" => "/", "name" => "Главная"],
            ["url" => "/programTV", "name" => "Программа TV"],
            ["url" => "/onlineTV", "name" => "Прямой эфир"]
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