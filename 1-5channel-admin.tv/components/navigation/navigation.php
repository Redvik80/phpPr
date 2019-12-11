<nav id="page-navigation">
    <?
        $links = [
            ["url" => "/home", "name" => "Главная"],
            ["url" => "/home-advertising", "name" => "Главная (реклама)"],
            ["url" => "/programs", "name" => "Телепередачи"],
            ["url" => "/scheldule", "name" => "Расписание"],
            ["url" => "/common-ettings", "name" => "Общие настройки"]
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