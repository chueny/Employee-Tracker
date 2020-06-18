var mysql = require("mysql");
var inquirer = require("inquirer");

const { STATUS_CODES } = require("http");
const { start } = require("repl");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "chueny20",
  database: "employeeTracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
 // createSong();
  selectArtist();
});

// A query which returns all data for songs sung by a specific artist

function selectArtist() {
  inquirer
    .prompt({
      name: "action?",
      type: "list",
      message: "What would you like to do?",
      choices:[
        "Add departments",
        "Add roles",
        "Add employees",
        "Update employee roles",
        "View departments",
        "View roles",
        "View employees"
      ],
  }).then(function(answer) {
      var query = "SELECT position, song, year FROM top5000 WHERE ?";
      connection.query(query, {artist: answer.artist}, function(err, res) {
        if (err) throw err;

        for (var  i=0; i<res.length; i++){
          console.log("Position:" + res[i].position + " || Song: "+ res[1].title + "|| Year: "+ res[1].year);
        } 
      });
  });
};

//function to add departments, roles, employees
//function to view departments, roles, employees
//function to update employee roles



