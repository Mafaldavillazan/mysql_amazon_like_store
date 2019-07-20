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
    displayProduct();
});

//Function that showcase all the items
function displayProduct() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //Make it nicer
        for (var i = 0; i < res.length; i++) {
            console.log("-----------------")
            console.log("ID:" + res[i].item_id
                + " || PRODUCT:" + res[i].product_name
                + " || PRIZE: $" + res[i].price);
        }
        selectProduct();
    });
}

//Function that prompts the user id selection of the item
function selectProduct() {
    inquirer
        .prompt([
            {
                name: "id_selection",
                type: "input",
                message: "Enter the id of the product you want to buy: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many do you want to buy: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT product_name FROM products WHERE item_id = ?";
            connection.query(query,[answer.id_selection], function (err, res) {
                if (err) throw err;
                //Display the selection
                for (var i = 0; i < res.length; i++) {
                    console.log("-----------------");
                    console.log("RESULT:" + JSON.stringify(res[i],null,2));
                }
            });
        });


}