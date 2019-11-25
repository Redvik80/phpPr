<? //sudo systemctl restart apache2
$db=pg_connect("host=localhost port=5432 dbname=phpDb user=postgres password=123");
$result=pg_fetch_all(pg_query($db, "select * from tv_program_ad"));

?>
<table class="programs-ad-crud-table">
    <thead>
        <tr>
            <th>id</th>
            <th colspan="2">Название</th>
            <th>Год</th>
            <th class="buttons-container"><button class="pi pi-plus add"></button></th>
        </tr>
    </thead>
    <tbody class="items">
        <?
            if ($result) {
                foreach($result as $row) {
        ?>
            <tr data-old-data="<?json_encode($result)?>">
                <td class="id-cell"><?=$row["id"]; ?></td>
                <td colspan="2">
                    <span class="name-text"><?=$row["name"]; ?></span>
                    <input class="name-input" value="<?=$row["name"]; ?>" maxlength="200">
                </td>
                <td class="year-cell">
                    <span class="year-text"><?=$row["year"]; ?></span>
                    <input class="year-input" value="<?=$row["year"]; ?>" type="number">
                </td>
                <td class="buttons-container">
                    <button class="pi pi-pencil change"></button>
                    <button class="pi pi-trash delete"></button>
                    <button class="pi pi-save save"></button>
                    <button class="pi pi-times cancel"></button>
                </td>
            </tr>
        <? }} ?>
    </tbody>
</table>