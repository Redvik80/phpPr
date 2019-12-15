<html></html>

<head>
    <title>1.5 канал</title>
    <meta charset="utf-8">

    <link rel="stylesheet" type="text/css" href="/node_modules/primeicons/primeicons.css" />

    <link rel="stylesheet" href="/dist/scheldule.css">
    <script src="/dist/scheldule.js" defer></script>
</head>

<body>
    <?include "../../components/navigation/navigation.php"?>

    <div class="scheldule-crud-container">
        <div class="table">
            <div class="table__head">
                <div class="table__content-cells-container">
                    <div class="table__cell _time">Время</div>
                    <div class="table__cell _program-name">Название</div>
                    <div class="table__cell _program-duration">Продолжительность</div>
                </div>

                <div class="table__cell _btns">
                    <input class="date-input" type="date">
                    <button class="pi pi-save table__btn _save"></button>
                    <button class="pi pi-times table__btn _cancel"></button>
                    <button class="pi pi-plus table__btn _add"></button>
                </div>
            </div>
            <div class="table__body"></div>
        </div>
    </div>
</body>

</html>