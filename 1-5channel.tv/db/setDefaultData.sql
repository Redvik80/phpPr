-- export PGPASSWORD=123
-- psql -h localhost -d phpDb -U postgres -p 5432 -a -w -f ./db/setDefaultData.sql

DELETE FROM scheldule;
DELETE FROM program;
DELETE FROM banner;
DELETE FROM page;

DROP FUNCTION IF EXISTS set_default_data;

CREATE FUNCTION set_default_data() RETURNS void AS $BODY$
    DECLARE
        random_hours FLOAT;
        day_count INT;
        current_program_id INT;
        current_banner_id INT;

    BEGIN
        FOR i IN 100..399 LOOP
            SELECT floor(random() * 4 + 1) INTO random_hours;
            day_count := floor((i-100)/25);
            INSERT INTO program VALUES(DEFAULT, CONCAT('Санта-Барбара часть 10', i) , random_hours*0.5*60*60, '', '', TRUE)
                RETURNING id INTO current_program_id;
            INSERT INTO scheldule VALUES(DEFAULT, 1578096000 + 86400 * day_count, current_program_id, (i-100)%25);
        END LOOP;

        INSERT INTO page VALUES
            (1, 'Главная', 'page 001', '001'),
            (2, 'Программа телепередач', 'page 002', '002'),
            (3, 'Online TV', 'page 003', '003');

        FOR i IN 100..119 LOOP
            INSERT INTO banner VALUES(
                DEFAULT, CONCAT('Санта-Барбара часть 10', i), 'Не смотрел, не знаю', ''
            ) RETURNING id INTO current_banner_id;
            IF i < 110 THEN
                INSERT INTO banner_page_relation VALUES(
                    DEFAULT, current_banner_id, 1, i - 100
                );
                IF i < 105 THEN
                    INSERT INTO banner_page_relation VALUES(
                        DEFAULT, current_banner_id, 3, i - 100
                    );
                END IF;
            END IF;
        END LOOP;

        INSERT INTO common_settings VALUES('1,5 канал', '', '');
    END;
$BODY$ LANGUAGE 'plpgsql' VOLATILE;

SELECT set_default_data();