<header>
    <img src="/files/images/5e14dc34b8919.png" alt="logo" class="logo">
    <nav class="page-navigation">
        <?
            $links = [
                ["url" => "/", "name" => "Главная"],
                ["url" => "/programTV", "name" => "Программа TV"],
                ["url" => "/onlineTV", "name" => "Прямой эфир"]
            ];
            foreach($links as $link) {
                $class = $_SERVER['REQUEST_URI'] === $link["url"] ? "class='selected'" : "";
                $href =  $link["url"];
                $text = $link["name"];
                echo "<a ${class} href='${href}'>${text}</a>";
            }
        ?>
    </nav>
</header>