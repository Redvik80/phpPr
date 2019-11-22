<? //sudo systemctl restart apache2
$db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
$result=pg_fetch_all(pg_query($db, "select * from tv_program"));

?>
<table class="programs-crud-table">
    <thead>
        <th>id</th>
        <th>Название</th>
        <th>Продолжительность</th>
        <th class="buttons-container"><button class="pi pi-plus add"></button></th>
    </thead>
    <tbody>
        <?
            foreach($result as $row) {
            $hours=floor($row["duration"] / 3600000);
            $minutes=floor(($row["duration"] - $hours * 3600000) / 60000);
        ?>
            <tr>
                <td class="id-cell"><?=$row["id"]; ?></td>
                <td>
                    <span class="program-name-text"><?=$row["program_name"]; ?></span>
                    <input class="program-name-input" value="<?=$row["program_name"]; ?>" maxlength="100">
                </td>
                <td class="duration-cell">
                    <span class="duration-text">
                    <?
                        if ($hours > 0) {
                            echo $hours . "ч. ";
                        }
                        if ($minutes > 0 || $hours === 0) {
                            echo $minutes . "мин.";
                        }
                    ?>
                    </span>
                    <span class="duration-inputs">
                        <input type="number" class="duration-hours" min="0" max="60" value="<?=$hours?>">ч.
                        <input type="number" class="duration-mins" min="0" max="24" value="<?=$minutes?>">мин.
                    </span>
                </td>
                <td class="buttons-container">
                    <button class="pi pi-pencil change"></button>
                    <button class="pi pi-trash delete"></button>
                    <button class="pi pi-save save"></button>
                    <button class="pi pi-times cancel"></button>
                </td>
            </tr>
        <? } ?>
    </tbody>
</table>