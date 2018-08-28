//Customer-interface:


// Set up npm requirements:
var inquirer = require("inquirer");
var chalk = require("chalk");
var mysql = require("mysql");
var Table = require("cli-table");

// Set up database log-in information:
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "store_db"
});

//TRY REWORKING SOME OF THIS WITH CONSTRUCTORS FOR CLEANER CODE.


//Define other global variables:

var fullProductPicked = {};
var item;
var itemBought;
var id = 0;

// Establish connection and verify:
connection.connect(function (err) {
    if (err) throw err;
    // console.log("Connected to db with id: "+connection.threadId);     
});



//Display the "buyer storefront where all relevant information is listed:"
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
                console.log(answer.buySelection);
                console.log(answer.buyQuantity);
                console.log(res[(answer.buySelection-1)].quantity);
                if (answer.buyQuantity < res[answer.buySelection].quantity) {
                    //update the db info now.
                    console.log("You bought it!" );
                } else if ((answer.buyQuantity >= res[answer.buySelection].quantity)) {
                    console.log("Not enough product to buy that many. Please see a manager to arrange for more to be stocked." );
                };
            });
    });
};




// //Function to select an item by its ID:
// var chooseByID = function (n) {
//     var query = "SELECT product FROM product_table WHERE ?";
//     connection.query(query, { id: n }, function (err, res) {
//         if (err) throw err;
//         id = n;
//         item = res[0].product;
//         // console.log("Test for id defined: "+id);
//         // console.log("Product at the id that the function called: " + item);
//         // console.log(item);
//     });
// };

// //Function that chooses what to buy
// var chooseToBuy = function () {
//     inquirer
//         .prompt([
//             {
//                 type: "input",
//                 name: "buySelection",
//                 message: "Choose an item you'd like to purchase!\n\nPlease provide us with the item's ID#: "
//             }
//         ])
//         .then(function (answerOne) {
//             id = answerOne.buySelection;
//             chooseByID(id);
//             var query = "SELECT * FROM product_table WHERE ?";
//             connection.query(query, { id: id }, function (err, res) {
//                 if (err) throw err;
//                 fullProductPicked = res[0];
//                 // console.log (fullProductPicked);
//                 // console.log (fullProductPicked.id + fullProductPicked.product + fullProductPicked.department+fullProductPicked.quantity+fullProductPicked.price);


//                 console.log("You've chosen to buy " + item + " from our store. Thanks!");

//                 inquirer
//                     .prompt([
//                         {
//                             type: "input",
//                             name: "buyQuantity",
//                             message: "How many would you like to purchase?"
//                         }
//                     ])
//                     .then(function (answerTwo) {
//                         console.log("Screw this hard.");
//                     });
//                     //     var howMany = answerTwo.buyQuantity;
//                     //     if (howMany >= fullProductPicked.quantity) {
//                     //         var newQuantity = (fullProductPicked.quantity - howMany);
//                     //         var query = "UPDATE product_table SET 10 WHERE id ="+answerOne.buySelection;
//                     //             // [
//                     //             //     {
//                     //             //         quantity: newQuantity
//                     //             //     },
//                     //             //     {
//                     //             //         id: id
//                     //             //     }
//                     //             // ];
//                     //         connection.query(query, { id: id }, function (err, res) {
//                     //             console.log(newQuantity);
//                     //             console.log("Purchase successful. Thank you!");
//                     //             generateStore();
//                     //             console.log("We made it through!" + howMany);
//                     //         });

//                     //     } else {

//                     //     };

//                     // }); //end of 2nd then
//         });
// });

generateStore();
// // populateProductList();
// // chooseByID(3);
// // chooseToBuy();