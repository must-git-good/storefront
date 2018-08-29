//Customer-interface (via node) for our mock digital storefront:


// Set up npm requirements:
// =============================================
var inquirer = require("inquirer");
var chalk = require("chalk");
var mysql = require("mysql");
var Table = require("cli-table");

// Set up database log-in information:
// =============================================
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "store_db"
});


//Define other global variables:
// =============================================
var totalPrice;         // This exists here to avoid scope issues. It will receive and hold the latest 'total' spent on each purchase.
var itemPrice;          // Same deal.  <^



// Establish connection and verify:
// =============================================
connection.connect(function (err) {
    if (err) throw err;
    // console.log("Connected to db with id: "+connection.threadId);     
});


// Display the "buyer storefront" where all relevant information is listed:
// =============================================
var generateStore = function () {
    var query = "SELECT * FROM product_table";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(chalk.green("\n\n=======\n\nWelcome to our digital storefront!\nPlease take a look around at any items you may want to purchase.\n\n=======\n"));
        var table = new Table({
            head: ["ID: ", "Item:", "Department:", "Price:", "#:"],
            colWidths: [7, 25, 30, 10, 7]
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product, res[i].department, res[i].price, res[i].quantity]
            );
        };
        console.log(table.toString());
        console.log("\n");
        chooseToBuy();
    });


};

// A function that asks the user what to buy and how many:
// =============================================
var chooseToBuy = function () {
    var query = "SELECT * FROM product_table";
    connection.query(query, function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "buySelection",
                    message: "Choose an item (by its ID#) that you'd like to purchase: "
                },
                {
                    name: "buyQuantity",
                    message: "How many of that item would you like? "
                },
            ])
            .then(function (answer) {
                var bought = parseInt(answer.buyQuantity);
                var exist = parseInt(res[(answer.buySelection - 1)].quantity);

                var query = "SELECT price FROM product_table WHERE id =" + answer.buySelection;
                connection.query(query, function (err, res) {
                    itemPrice = parseFloat(res[0].price);
                    if (bought <= exist) {
                        var amountLeft = parseInt(exist - bought);
                        var query = "UPDATE product_table SET quantity = " + amountLeft + " WHERE id =" + answer.buySelection;
                        connection.query(query, function (err, res) {
                            if (err) throw err;
                            totalPrice = parseFloat(bought * itemPrice);
                        });
                        updateChart();
                    } else if (exist < bought) {
                        console.log(chalk.yellow("Not enough product to buy that many. Please see a manager to arrange for more to be stocked."));
                        buyMoreQuestion();
                    };
                });
            });
    });
};

// An asynchronous-friendly way of doing recursion in a controlled way: We use inquirer prompts to either "continue shopping" or to exit the program.
// =============================================
var buyMoreQuestion = function () {
    console.log(chalk.blue("\n\n\nThanks for shopping with us!\n\n"));
    inquirer
        .prompt([
            {
                name: "buyMore",
                message: "Would you like to make another purchase?"
            }
        ])
        .then(function (answer) {
            if (answer.buyMore === ("yes" || "y" || "Yes" || "Y" || "yeah" || "Yeah" || "Ok" || "k" || "yup" || "Yup" || "ok" || "Alright" || "alright" || "ya" || "Ya" || "1" || "true" || "sure" || "Sure" || "why not" || "duh")) {
                chooseToBuy();
            }
            else {
                return console.log("Thanks anyway, we're sorry to see you go!");
            }
        });
};

// Updates charts once a purchase has been made and displays the cost of the purchase to the user.
// =============================================
var updateChart = function () {
    var query = "SELECT * FROM product_table";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(chalk.green("\n\n=======\n\nYour purchase has processed successfully."));
        console.log(chalk.yellow("You spent " + totalPrice + " dollars.\n"));
        console.log(chalk.green("We've updated quantities based on your purchases. Here's the store now: \n\n=======\n"));
        var table = new Table({
            head: ["ID: ", "Item:", "Department:", "Price:", "#:"],
            colWidths: [7, 25, 30, 10, 7]
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product, res[i].department, res[i].price, res[i].quantity]
            );
        };
        console.log(table.toString());
        console.log("\n");
        buyMoreQuestion();
    });
};

// Kick it off.
// =============================================
generateStore();
