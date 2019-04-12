DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Dish set", "Home Goods", 125, 15),
("Basketball Hoop", "Recreation", 200, 5),
("Mircrowave", "Home Goods", 65, 12),
("Frisbee", "Recreation", 3.50, 75),
("Dog Food", "Pets", 35, 30),
("Collar and Leash Set", "Pets", 25, 48),
("Candle", "Home Goods", 10.75, 105),
("Lamp", "Home Goods", 18.99, 20),
("T-Shirt", "Clothing", 4.99, 200),
("Sweater", "Clothing", 24.99, 32);

SELECT * FROM products;