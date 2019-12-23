-- export PGPASSWORD=123
-- psql -h localhost -d phpDb -U postgres -p 5432 -a -w -f ./db/createDb.sql

DROP TABLE IF EXISTS scheldule;
DROP TABLE IF EXISTS program;
DROP TABLE IF EXISTS advertising;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS page;

CREATE TABLE program(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    duration INT,
    link TEXT
);

CREATE TABLE scheldule(
    id SERIAL PRIMARY KEY,
    "date" BIGINT,
    program_id INT,
    "order" INT,

    FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
);

CREATE TABLE advertising(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    description VARCHAR(2000),
    year INT,
    img_file_name VARCHAR(100),
    is_block BOOLEAN,
    "order" INT
);

CREATE TABLE "user"(
    id SERIAL PRIMARY KEY,
    login VARCHAR(25),
    passhash CHAR(32),
    access_token CHAR(13),
    csrf_token CHAR(13)
);

CREATE TABLE page(
    name VARCHAR(50) PRIMARY KEY,
    data JSON DEFAULT '{}'
);