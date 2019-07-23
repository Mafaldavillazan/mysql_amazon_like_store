//Justify our variables from our diffferent packages
var inquirer = require("inquirer");
var mysql = require("mysql");

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//Connect to our data base without sharing our info
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
});

//Connect to our data base
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayOptions();
});

//Function that showcase all the items
function displayOptions() {
    inquirer
        .prompt([
            {
                name: "options",
                type: "list",
                message: "Menu Options: ",
                choices: ["View products for sale",
                    "View low inventory",
                    "Add to inventory",
                    "Add new product",
                    "EXIT"]
            }
        ])
        .then(function (answer) {

            switch (answer.options) {
                case "View products for sale":
                    viewProductsSell();
                    break;
                case "View low inventory":
                    viewLowInventory();
                    break;
                case "Add to inventory":
                    console.log("Success!");
                    break;
                case "Add new product":
                    console.log("hello!");
                    break;
                case "EXIT":
                    console.log("hello!");
                    connection.end();
                    break;
            }
        })
}

function viewProductsSell() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //Make it nicer
        for (var i = 0; i < res.length; i++) {
            console.log("----------------------------------------")
            console.log("ID:" + res[i].item_id
                + " || PRODUCT:" + res[i].product_name
                + " || PRIZE: $" + res[i].price
                + " || QUANTITIES: " + res[i].stock_quantity
            );
        }
        displayOptions()
    });

}

function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var arrLowInventory = []
        
        //For loop the result to push it into an array of low inventory
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                arrLowInventory.push(res[i])
            }
        }

        if (arrLowInventory) {
            console.log("----------------------------------------")
            console.log("   YOUR LOW INVENTORY IS    ")
            console.log("----------------------------------------")
            
            for (var i = 0; i < arrLowInventory.length; i++) {
                console.log("ID:" + arrLowInventory[i].item_id
                    + " || PRODUCT:" + arrLowInventory[i].product_name
                    + " || PRIZE: $" + arrLowInventory[i].price
                    + " || QUANTITIES: " + arrLowInventory[i].stock_quantity
                );
            }
            console.log("----------------------------------------")
        }
        else {
            console.log("----------------------------------------")
            console.log("         YOU HAVE NO LOW INVENTORY           ")
            console.log("----------------------------------------")
        }
       
    });
}