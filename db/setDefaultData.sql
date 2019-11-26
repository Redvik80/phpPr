-- export PGPASSWORD=123
-- psql -h localhost -d phpDb -U postgres -p 5432 -a -w -f /var/www/html/db/setDefaultData.sql

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
            INSERT INTO scheldule VALUES(DEFAULT, 1574632800000 + 86400000 * day_count, current_program_id, (i-100)%25 + 1);
        END LOOP;

        advertising_is_block := TRUE;
        FOR i IN 100..109 LOOP
            advertising_is_block := NOT advertising_is_block;
            INSERT INTO advertising VALUES(
                DEFAULT, CONCAT('Санта-Барбара часть 10', i), 'Не смотрел, не знаю',
                2019, '', advertising_is_block, i - 99
            );
        END LOOP;
    END;
$BODY$ LANGUAGE 'plpgsql' VOLATILE;

SELECT set_default_data();