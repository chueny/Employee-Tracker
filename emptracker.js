const mysql = require("mysql");
const inquirer = require("inquirer");

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
  inquirer.prompt({
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

      case "Add departments, roles, employees":
        addAll(); 
        break;

      case "Update Employee Role":
        updateEmployeeRole();
        break;

      case "Exit":
        connection.end();
        break;
      }
  });
};

function viewAll(){
  connection.query(
  `SELECT first_name, last_name, title, department_name, salary
  FROM department
  JOIN role ON department.id =role.department_id
  JOIN employee ON role.id = employee.role_id`, 
  function(err, res) {
    if (err) throw err;
    console.table(res);
  });
  selectEmployeeAction();
};

function validateSalary(amt){
  let reg = /^\d+$/;
  return reg.test(amt) || "Salary should be a number!";
};

function validateString(str){
  var letters = /^[A-Z a-z]+$/;
   if(str.match(letters)){
      return true;
  }
   else{
     return "You must enter a string.";
  }
};

//========THE FUNCTIONS BELOW DO NOT WORK YET =========

function addAll(){
  inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the employee's first name?",
      validateString
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the employee's last name?",
      validateString
    },
    {
      name: "title",
      type: "input",
      message: "What is the employee's title?",
      validate: validateString
    },
    {
      name: "salary", 
      type: "input",
      message: "What is the employee's salary?",
      validate: validateSalary
    },
    {
      name: "department",
      type: "input",
      message: "What is the employee's department? (1=Customer Service, 2=Engineering, 3=Finance, 4=Human Resources, 5=IT, 6=Legal, 7=Marketing, 8=Operations, 9=Sales)",
      validate: function(value) {
        if (isNaN(value) === false && value > 0 && value < 10) {
          return true;
       }
        else{
          return "You must enter a valid number.";
        }
      }
    }
]).then(function(answer) {
  //console.log("We are in the addAll function!");

  //checks that role does not already exit 

  connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary:answer.salary,
      department_id: answer.department
    }, 
    function(err, results){
      if (err) throw err;
      //console.log("You're role was created successfully!");
      //console.log("Printing results", results);

      //we reprint the roles?
    }
  )

  connection.query("SELECT id FROM role WHERE ?", {title: answer.title}, function(err, results) {
    //console.log("In newRole:", results);  
    let newRole= results[0].id;
    
      connection.query("INSERT INTO employee SET ?", 
        {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: newRole
      }, 
      function(err){
        if (err) throw err;
        console.log("You're employee was created successfully!"); 
      }
      );
  });
});
}

function updateEmployeeRole(){
  //who which employee do you want to update? prompt user for who they want to update
  connection.query
  (`SELECT first_name, last_name, title, department_id 
  FROM department 
  JOIN role ON department.id =role.department_id 
  JOIN employee ON role.id = employee.role_id`,
  // ("SELECT * FROM employee", 
  function (err, results){
    if (err) throw err;
    console.log("I am in the updateEmployeRole!");

    inquirer.prompt([
      {
        name: "role",
        type: "rawlist",
        choices: function() {
          var employeeArray = [];
          for (var i = 0; i < results.length; i++) {
            employeeArray.push("Name: "+ results[i].first_name + " "+ results[i].last_name  + " "+ results[i].title+ " DeptID: "+ results[i].department_id);
          }
          return employeeArray;
        },
        message: "Which employee do you want to update?"
      },
      {
        name: "newID",
        type: "list",
        message: "What is the new role?",
        choices: function() {
          var idArray = [];
          for (var i = 0; i < results.length; i++) {
            idArray.push(results[i].id);
          }
          return idArray;
        }
        //1) select from a list // with
        //2) Creaate a new role
      }
    ]).then(function(answer){
          connection.query("UPDATE employee SET role_Id = ? WHERE  id = ? ", 
          [
            {
              role_id: answer.newID,
            },
            {
              id: answer.role  //does this mean we need to grab the role id 
            }
          ],
          function (err, results){
          console.log("Employee role is updated!");
            
          });
          viewAll();
    });
  });
}