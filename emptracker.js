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

function selectEmployeeAction(){
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

  //checks that role does not already exit 
  console.log("What is answer.department:", answer.department);
  console.log("What is answer.title:", answer.title);
  console.log("What is answer.salary:", answer.salary);
  connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.department
    }, 
    function(err, results){
      if (err) throw err;
    }
  )

  connection.query("SELECT id FROM role WHERE ?", {title: answer.title, }, function(err, results) { 
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
        viewAll();
      }
      );
  });
});
}

//========THE FUNCTIONS BELOW DO NOT WORK YET =========
function getAllRoles(callback){
  connection.query("SELECT * FROM role", function(err,res){
    callback(err, res);
  });
};

function updateEmployeeRole(){
  //who which employee do you want to update? prompt user for who they want to update
  getAllRoles(function (err, roles){
    if (err) throw err;

    connection.query
    (`SELECT first_name, last_name, title, department_id, employee.id  
    FROM department 
    JOIN role ON department.id =role.department_id 
    JOIN employee ON role.id = employee.role_id`,
    function (err, employees){
      if (err) throw err;
      inquirer.prompt([
        {
          name: "employee",
          type: "list",
          choices: function selectEmployee(){
            var employeeArray = [];
            for (var i = 0; i < employees.length; i++) {
              employeeArray.push(  {name:"Name: "+ employees[i].first_name + " "+ employees[i].last_name  + ", Title: "+ employees[i].title+ ", DeptID: "+ employees[i].department_id, value: employees[i].id});
            }
            return employeeArray;
          },
          message: "Which employee do you want to update?"
        },
        {
          name: "role",
          type: "list",
          choices: function updateRole(){
            let roleArray = [];
            for (var i = 0; i < roles.length; i++) {
              roleArray.push({name: roles[i].title, value:roles[i].id});
            }
            return roleArray;
          },
            message: "What is the new role?"
        }]).then((answers) =>{
            let selectedEmployeeId = answers.employee;
           
            console.log("What is the answer:", answers);
            console.log("What is the role ID:", answers.role);
            console.log("What is the Emplyee ID:", answers.employee);
  
                const rawquery = connection.query(//"UPDATE role SET title =? WHERE role_Id =?"
                "UPDATE employee SET role_id = ? WHERE id = ?", 
                [
                   answers.role,
                  answers.employee
                ], 
                function (err){
                  console.log("Employee role is updated!");
                  viewAll();
                });
                console.log("rawquery", rawquery);      
        });
    });
  });
};


// I have a function that takes as a parameter another function 
function getData(callback){
  // get stuff from the db and once you have it call the passed in function in this case named "callback"

  callback("hello");
}

getData(function fn(mystring){
  console.log(mystring)
})
