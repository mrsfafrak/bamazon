var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "trilogy",
    password: "password123",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to Tori's Bamazon Manager View!")
    start();
});

function start() {
    inquirer.prompt({
        name: "managerChoice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
    }).then(function (answer) {
        switch (answer.managerChoice) {
            case "View Products for sale":
                return displayTable();
            case "View Low Inventory":
                return lowInventory();
            case "Add to Inventory":
                return addInventory();
            case "Add New Product":
                return addNewProduct();
            default:
                return connection.end();
        }
    })
}

function displayTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Quantity']
            , colWidths: [5, 23, 15, 10, 15]
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        start();
    });
}

function lowInventory() {
    connection.query("SELECT * from products WHERE stock_quantity < ?", [5], function (err, res) {
        if (!res.length) {
            console.log("No Low Inventory");
            start();
        }
        else {
            var table = new Table({
                head: ['ID', 'Product Name', 'Department', 'Price', 'Quantity']
                , colWidths: [5, 23, 15, 10, 15]
            });
            for (var i = 0; i < res.length; i++) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
                );
            }
            console.log(table.toString());
            start();
        }
    })
}

function addInventory() {
    inquirer.prompt([
        {
            name: "add_id",
            type: "input",
            message: "What is the ID of the product you want to add inventory to?",
            validate: function (value) {
                if ((isNaN(value) === false) && (value % 1 === 0) && value !== "") {
                    return true;
                }
                console.log("\nEnter a whole number please.")
                return false;
            }
        },
        {
            name: "amount",
            type: "input",
            message: "How many units of the product would you like to add?",
            validate: function (value) {
                if ((isNaN(value) === false) && (value % 1 === 0) && value !== "") {
                    return true;
                }
                console.log("\nEnter a whole number please.")
                return false;
            }
        }
    ]).then(function (answer) {
        connection.query("SELECT * from products where item_id=?", [answer.add_id], function (err, res) {
            if (!res.length) {
                console.log("That product ID does not exist. Try again.");
                start();
            }
            else {
                newQuant = parseInt(res[0].stock_quantity) + parseInt(answer.amount);
                connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newQuant, answer.add_id], function (err, res) {
                    console.log("Inventory updated");
                    start();
                })
            }
        })
    })
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product you would to add?",
            validate: function (value) {
                if (value !== "") {
                    return true;
                }
                console.log("\nEnter a product please.")
                return false;
            }
        },
        {
            name: "dept_name",
            type: "input",
            message: "What department does this product fall into?",
            validate: function (value) {
                if (value !== "") {
                    return true;
                }
                console.log("\nEnter a department please.")
                return false;
            }
        },
        {
            name: "price",
            type: "input",
            message: "Price?",
            validate: function (value) {
                if ((isNaN(value) === false) && value !== "") {
                    return true;
                }
                console.log("\nEnter a number please.")
                return false;
            }
        },
        {
            name: "stock",
            type: "input",
            message: "How many are in stock?",
            validate: function (value) {
                if ((isNaN(value) === false) && (value % 1 === 0) && value !== "") {
                    return true;
                }
                console.log("\nEnter a whole number please.")
                return false;
            }
        },
    ]).then(function (answer) {
        connection.query("INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (?,?,?,?)", [answer.product_name, answer.dept_name, answer.price, answer.stock], function (err, res) {
            console.log("Inventory added!");
            start();
        })
    })
}

