# dev schema 생성
CREATE SCHEMA dev;

USE dev;

# user 테이블 생성
CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

# user 테이블에 테스트 데이터 5개 추가
INSERT INTO user (name, email, password) VALUES ('Alice1', 'alice@example.com', 'password1');
INSERT INTO user (name, email, password) VALUES ('Bob1', 'bob@example.com', 'password2');
INSERT INTO user (name, email, password) VALUES ('Charlie1', 'charlie@example.com', 'password3');
INSERT INTO user (name, email, password) VALUES ('David1', 'david@example.com', 'password4');
INSERT INTO user (name, email, password) VALUES ('Eve1', 'eve@example.com', 'password5');
