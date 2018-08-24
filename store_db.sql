DROP DATABASE IF EXISTS store_db;
CREATE DATABASE store_db;
USE store_db;

CREATE TABLE product_table (
    id INT NOT NULL AUTO_INCREMENT,
    product VARCHAR(30) NOT NULL,
    department VARCHAR(20) NOT NULL,
    price DECIMAL(7,2) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (id)
);


INSERT INTO product_table (product, department, price, quantity)
VALUES  ("apple", "grocery", 1.43, 80),
        ("banana", "grocery", .87, 150),
        ("chocolate bar", "grocery", .99, 250),
        ("dental floss", "personal care", 2.00, 47),
        ("excedrin", "personal care", 6.85, 35),
        ("firetruck", "children's toys", 13.25, 8),
        ("G.I. Joe", "children's toys", 6.50, 20),
        ("Hula-Hoop", "children's toys", 5, 100),
        ("iPad", "electronics", 350, 25),
        ("Jumper Cables", "automotive", 25, 10),
        ("Knickers", "antiquated clothing", 19.99, 17);


SELECT * FROM product_table;

-- END STARTER FILE