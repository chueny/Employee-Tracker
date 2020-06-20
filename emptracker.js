const mysql = require("mysql");
const inquirer = require("inquirer");
// const cTable = require("console.table");

const { STATUS_CODES } = require("http");
const { start } = require("repl");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "chueny20",
  database: "employeeTracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  selectEmployeeAction();
});

function selectEmployeeAction() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices:[
        "View departments, roles, employees",
        "Add departments, roles, employees",
        "Update Employee Role",   
        "Exit"
      ],
  }).then(function(answer) {

      switch (answer.action){
      case "View departments, roles, employees":
        viewAll();
        break;

      // case "Add departments, roles, employees":
      //   addAll();
      //   break;

      // case "Update Employee Role":
      //   updateEmployeeRole();
      //   break;

      case "Exit":
        connection.end();
        break;
      }
  });
};

function viewAll(){
  connection.query(
  "SELECT first_name, last_name, title, department_name, salary FROM department JOIN role ON department.id =role.department_id JOIN employee ON role.department_id = employee.role_id", function(err, res) {
    if (err) throw err;
    console.table(res);
  });
};

function addAll(){
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err;
    console.log(res);
  });
};

function updateEmployeeRole(){
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
    console.log(res);
  });
};
