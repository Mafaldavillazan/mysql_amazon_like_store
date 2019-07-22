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
                    "Add new product"]
            }
        ])
        .then(function (answer) {
            console.log("------------");
            console.log("The manger has selected: " + JSON.stringify(answer));
            console.log("------------")
        })
}