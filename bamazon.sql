DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INT(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price DECIMAL(10,2) NULL,
    stock_quantity INT(10) NULL,
    PRIMARY KEY(item_id)
)


INSERT INTO products (product_name,department_name,pricestock_quantity)
VALUES("Bed linen","House Utensils",6.99,20),
("Forks","House Utensils",4.99,20),
("Rimmel","Make Up",3.99,20),
("Blush","Make up",3.99,20),
("Running shoes","Sports",25.99,20),
("Golf balls","Sports",8.99,20),
("Math book","Books",13.10,20),
("Monocle Magazine","Books",3.15,20),
("T-shirt","Clothing",20.00,20),
("shorts","Clothing",15.00,20)