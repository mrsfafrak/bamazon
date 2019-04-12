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
    console.log("Connected to Tori's Bamazon!")
    start();
});

function start() {
    displayTable();
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
        questions();
    });
}

function questions() {
    inquirer.prompt([
        {
            name: "buy_id",
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            validate: function (value) {
                if ((isNaN(value) === false) && (value % 1 === 0) && value !== "") {
                    return true;
                }
                console.log("\nEnter a whole number please.")
                return false;
            }
        },
        {
            name: "desired_quantity",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function (value) {
                if ((isNaN(value) === false) && (value % 1 === 0) && value !== "") {
                    return true;
                }
                console.log("\nEnter a whole number please.")
                return false;
            }
        }

    ]).then(function (answer) {

        connection.query("SELECT * FROM products WHERE item_id=?", [answer.buy_id], function (err, res) {
            if (parseInt(res[0].stock_quantity) < parseInt(answer.desired_quantity)) {
                console.log("Insufficient quantity! Try again.")
                nextStep();
            }
            else {
                var newQuant = parseInt(res[0].stock_quantity) - parseInt(answer.desired_quantity);
                connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuant, answer.buy_id], function (err, res) {
                    console.log("Purchase complete!");
                    nextStep();
                })
            }
        })
    })

}

function nextStep() {
    inquirer.prompt({
        name: "nextStep",
        type: "list",
        message: "What would you like to do now?",
        choices: ["I want to buy more!", "Quit"]
    }).then(function (answer) {
        if (answer.nextStep === "Quit") {
            connection.end();
        }
        else {
            start();
        }
    })
}