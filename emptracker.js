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
        //can i call 2 different function here or addAll to call three below ? 
        //addAll(); 
        addRoleDept();
        //addEmployee();
        break;

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
  selectEmployeeAction();
};

function validateSalary(amt){
  let reg = /^\d+$/;
  return reg.test(amt) || "Salary should be a number!";
}

function validateString(str){
  var letters = /^[A-Z a-z]+$/;
   if(str.match(letters)){
      return true;
  }
   else{
     return "You must enter a string.";
  }
}


//========THE FUNCTIONS BELOW DO NOT WORK YET =========

function addAll(){
  //function addEmployee();
  //function addEmployeeRole();
  //function addEmployeeDept();
};

function addRoleDept(){
  inquirer.prompt([
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
    // choices:[
    //   "Customer Service",
    //   "Engineering",
    //   "Finance",
    //   "Human Resources",
    //   "IT",
    //   "Legal",
    //   "Marketing",
    //   "Operations",
    //   "Sales"
    //   //or another option if we have time
    // ],
  }
]).then(function(answer) {
  console.log("We are in the role and department function!");

  connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary:answer.salary,
      department_id: answer.department
      // VALUES ("\"" + answer.title+ "\"", answer.salary, answer.id)
    }, 
    function(err){
      if (err) throw err;
      console.log("You're role was created successfully!");
      //Do restart the program?
    }
  );
  });
}

function addEmployee(){
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
    }
    // {
    //   name: "addEmployee",
    //   type: "input",
    //   message: "What is the employee's role id?",
    //   //we may need to check that this id has not been used? b/c
    //   //role_ID is unique and is tied to the id from role table?
    //   //this may need to be built in?
    // }
  ]).then(function(answer) {
    // connection.query("SELECT * FROM role", function(err, res) {
    //   if (err) throw err;
    //   console.log(res);
    // });
    
    //we need the role_id from role.  we may need to send a 
    //query to MYSQL. DO we need dto await responses first?

    
    //INSERT INTO employee (first_name, last_name, role_id)
    //VALUES ("Geraldine",  "Nune", 7);
    //print update to console
  
    console.log("We are in the addEmployee function!");
  });
};

function updateEmployeeRole(){
  // connection.query("SELECT * FROM employee", function(err, res) {
  //   if (err) throw err;
  //   console.log(res);
  // });

  //who which employee do you want to update? 
  // how do we print out a list of people for them to choose from
  // if they choose from a specific list.. need to connect that to
  // UPDATE role
  // SET column1 = value1, column2 = value2, ...
  // WHERE condition;
  

  //column (title, salary, department_id)
  //where conditions  (which row...)

};
