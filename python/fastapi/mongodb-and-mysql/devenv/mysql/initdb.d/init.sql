CREATE TABLE log
(
    id         bigint unsigned auto_increment not null,
    data       text                           not null,
    created_at datetime                       not null default now(),
    PRIMARY KEY (id)
);

INSERT INTO log (data, created_at)
VALUES ('Test data 1', '2024-09-23 13:00:00'),
       ('Test data 2', '2024-09-24 13:00:00'),
       ('Test data 3', '2024-09-25 13:00:00'),
       ('Test data 4', '2024-09-26 13:00:00'),
       ('Test data 5', '2024-09-27 13:00:00');
