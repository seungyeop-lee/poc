create database shopdb;

use shopdb;

CREATE TABLE products
(
    `id`    INT         NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(45) NOT NULL,
    `stock` INT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE patrons
(
    `id`         INT          NOT NULL AUTO_INCREMENT,
    `login_id`   VARCHAR(20)  NOT NULL,
    `password`   VARCHAR(100) NOT NULL,
    `email`      VARCHAR(50)  NOT NULL,
    `deleted_at` DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE orders
(
    `id`         INT      NOT NULL AUTO_INCREMENT,
    `product_id` INT      NOT NULL,
    `patron_id`  INT      NOT NULL,
    `quantity`   INT      NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

ALTER TABLE orders
    ADD CONSTRAINT FK_orders_product_id_products_id FOREIGN KEY (product_id)
        REFERENCES products (id);

ALTER TABLE orders
    ADD CONSTRAINT FK_orders_patron_id_patrons_id FOREIGN KEY (patron_id)
        REFERENCES patrons (id);


CREATE TABLE deliveries
(
    `id`          INT         NOT NULL AUTO_INCREMENT,
    `order_id`    INT         NOT NULL,
    `address`     VARCHAR(45) NOT NULL,
    `isDelivered` bool        NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);

ALTER TABLE deliveries
    ADD CONSTRAINT FK_deliveries_order_id_orders_id FOREIGN KEY (order_id)
        REFERENCES orders (id);