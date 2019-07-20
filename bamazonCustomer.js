var mysql = require("mysql");

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
  });
  
  function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
        //Make it nicer
        for (var i = 0; i < res.length; i++) {
            console.log("-----------------")
            console.log("ID:" + res[i].item_id 
            + "\nPRODUCT:" + res[i].product_name
            + "\nPRIZE: $" + res[i].price);
        }
        connection.end();
    });
  }
  