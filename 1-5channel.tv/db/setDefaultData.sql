-- export PGPASSWORD=123
-- psql -h localhost -d phpDb -U postgres -p 5432 -a -w -f ./db/setDefaultData.sql

DELETE FROM scheldule;
DELETE FROM program;
DELETE FROM advertising;

DROP FUNCTION set_default_data;

CREATE FUNCTION set_default_data() RETURNS void AS $BODY$
    DECLARE
    random_hours FLOAT;
    day_count INT;
    current_program_id INT;
    advertising_is_block BOOLEAN;
    BEGIN
        FOR i IN 100..399 LOOP
            SELECT floor(random() * 4 + 1) INTO random_hours;
            day_count := floor((i-100)/25);
            INSERT INTO program VALUES(DEFAULT, CONCAT('Санта-Барбара часть 10', i) , random_hours*0.5*1000*60*60)
                RETURNING id INTO current_program_id;
            INSERT INTO scheldule VALUES(DEFAULT, 1573603200000 + 86400000 * day_count, current_program_id, (i-100)%25 + 1);
        END LOOP;

        advertising_is_block := TRUE;
        FOR i IN 100..109 LOOP
            advertising_is_block := NOT advertising_is_block;
            INSERT INTO advertising VALUES(
                DEFAULT, CONCAT('Санта-Барбара часть 10', i), 'Не смотрел, не знаю',
                2019, '', advertising_is_block, i - 99
            );
        END LOOP;

        INSERT INTO page VALUES
        (
            'home',
            '{
                "title1": "Добро пожаловать",
                "description1": "Кружится голова от разнообразия контента на YouTube? На выбор тратишь больше времени,
                    чем на просмотр, а за тебя выбрать некому? Если это так, то ты обратился по адресу. 1,5 канал - первый
                    в мире телеканал, крутящий ролики с YouTube. Шикарно, да? Можешь не отвечать, я это и так знаю.
                    Тебе больше не при придётся выбирать среди тысяч одинаково тупых роликов. Мы зделаем этот сложный выбор за тебя!
                    Всё что от тебя требуется это включить наш телеканал и смотреть не отвлекаясь, пока руки не начнут трястись от голода.
                    Да, да, мечты сбываются. Приятного просмотра."
                "title2": "Скоро на 1,5 канале",
                "description2": "Не пропустите..."
            }'
        ),(
            'commonSettings',
            '{
                "logo": null,
                "favicon": null,
                "title": "1,5 канал"
            }'
        );
    END;
$BODY$ LANGUAGE 'plpgsql' VOLATILE;

SELECT set_default_data();