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

function start(){
    inquirer.prompt({
        name:"managerChoice",
        type:"list",
        message:"What would you like to do?",
        choices:["View Products for sale","View Low Inventory","Add to Inventory","Add New Product","Quit"]
    }).then(function (answer){
        switch(answer.managerChoice){
            case "View Products for sale":
                return displayTable();
            case "View Low Inventory":
                return lowInventory();
            case "Add to Inventory":
                return console.log("Add Inventory");
            case "Add New Product":
                return console.log("New product");
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

function lowInventory{
    
}


// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.