-- export PGPASSWORD=123
-- psql -h localhost -d phpDb -U postgres -p 5432 -a -w -f /var/www/html/createDb.sql

CREATE TABLE tv_program(
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(100),
    duration INT
);

CREATE TABLE tv_scheldule(
    id SERIAL PRIMARY KEY,
    scheldule_date BIGINT,
    program_id INT,
    otherDuration INT,

    FOREIGN KEY (program_id) REFERENCES tv_program(id)
);

CREATE TABLE user(
    id SERIAL PRIMARY KEY,
    login VARCHAR(25),
    passhash CHAR(32),
    access_token CHAR(13),
    csrf_token CHAR(13)
);
