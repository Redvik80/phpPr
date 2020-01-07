-- export PGPASSWORD=123
-- psql -h localhost -d phpDb -U postgres -p 5432 -a -w -f ./db/createDb.sql

DROP TABLE IF EXISTS scheldule;
DROP TABLE IF EXISTS program;

DROP TABLE IF EXISTS banner_page_relation;
DROP TABLE IF EXISTS banner;
DROP TABLE IF EXISTS page;

DROP TABLE IF EXISTS common_settings;
DROP TABLE IF EXISTS "user";

CREATE TABLE program(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    duration INT,
    file_name VARCHAR(50),
    youtube_id VARCHAR(50),
    from_youtube BOOLEAN
);

CREATE TABLE scheldule(
    id SERIAL PRIMARY KEY,
    "date" BIGINT,
    program_id INT,
    "order" INT,

    FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
);

CREATE TABLE banner(
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    file_name VARCHAR(100)
);

CREATE TABLE page(
    id INT PRIMARY KEY,
    navigation_name VARCHAR(100),
    title VARCHAR(200),
    description TEXT
);

CREATE TABLE banner_page_relation(
    id SERIAL PRIMARY KEY,
    banner_id INT,
    page_id INT,

    FOREIGN KEY (banner_id) REFERENCES banner(id) ON DELETE CASCADE,
    FOREIGN KEY (page_id) REFERENCES page(id) ON DELETE CASCADE
);

CREATE TABLE common_settings(
    head_title VARCHAR(200),
    favicon_file_name VARCHAR(100),
    logo_file_name VARCHAR(100)
);

CREATE TABLE "user"(
    id INT PRIMARY KEY,
    login VARCHAR(50),
    passhash VARCHAR(255),
    token VARCHAR(13)
);