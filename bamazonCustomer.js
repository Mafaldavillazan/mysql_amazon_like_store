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
            var query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE item_id = ?";
            connection.query(query, [answer.id_selection], function (err, res) {
                if (err) throw err;
                //Display the selection
                for (var i = 0; i < res.length; i++) {
                    console.log("-----------------")
                    console.log("YOU WANT TO BUY: "
                        + res[i].product_name
                        + " || PRIZE: $" + res[i].price);

                    //If the value is less than the stock quantity say insufficient quantity
                    if (res[i].stock_quantity < answer.quantity) {
                        console.log("Insuficient Quantity")
                        otherItem();
                    }
                    else {
                        console.log("We can sell toy some of it")
                        //Input information that will run the function to update the DB
                        updateStock(res[i].stock_quantity, answer.quantity, res[i].item_id)
                        priceTopay(res[i].price)
                    }
                    console.log("-----------------")
                }
                
            });
        });
}

//Updating the data base with the new value
function updateStock(resQuantity, answerQuantity, itemID) {
    var updatedResult = resQuantity - answerQuantity; 
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: updatedResult
            },
            {
                item_id: itemID
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log("Product ready to purchase")

        }
    );

}

function priceTopay(price) {
    console.log("-----------")
    console.log("You need to pay: $" + price)
    console.log("-----------")
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "payment",
                message: "Are you ready to pay?",
                default: true
            }
        ])
        .then(function(answers){
            if(answers.payment){
                console.log("-------")
                console.log("Thanks for your purchase")
                console.log("-------")
                otherItem()
            }
            else{
                console.log("-------")
                console.log("No problem")
                console.log("-------")
                otherItem()
            }
        })
}

function otherItem(){
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "buyAgain",
                message: "Want to buy other item?",
                default:true
            }
        ])
        .then(function(answers){
            if(answers.buyAgain){
                displayProduct()
            }
            else{
                console.log("We hope to see you soon")
                connection.end();
            }
        })
}

