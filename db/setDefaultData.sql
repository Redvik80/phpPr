-- export PGPASSWORD=123
-- psql -h localhost -d phpDb -U postgres -p 5432 -a -w -f /var/www/html/db/setDefaultData.sql

DELETE FROM tv_scheldule;
DELETE FROM tv_program;

INSERT INTO tv_program VALUES(DEFAULT, 'Утро на 1,5 канале', 1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Новости на 1,5 канале', 1.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10253', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10254', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10255', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10256', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10257', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10258', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10259', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10260', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10261', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10262', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10263', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10264', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10265', 0.5*1000*60*60);
INSERT INTO tv_program VALUES(DEFAULT, 'Санта-Барбара сезон 531, часть 10266', 0.5*1000*60*60);
-- INSERT INTO tv_scheldule VALUES(1572580800000, );