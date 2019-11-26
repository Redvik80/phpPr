<nav id="page-navigation">
    <?
        $links = [
            ["url" => "/pages/admin/home/home.php", "name" => "Главная"],
            ["url" => "/pages/admin/programs/programs.php", "name" => "Телепередачи"],
            ["url" => "/pages/admin/scheldule/scheldule.php", "name" => "Расписание"],
            ["url" => "/pages/admin/commonSettings/commonSettings.php", "name" => "Общие настройки"]
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