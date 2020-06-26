const mysql = require("mysql");
const inquirer = require("inquirer");

const { STATUS_CODES } = require("http");
const { start } = require("repl");
const { connect } = require("http2");

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
        "Add a new employee",
        "Add a new department",
        "Add a new role",
        "Update an employee role", 
        "Delete a department",  
        "Exit"
      ],
  }).then(function(answer) {
      switch (answer.action){
      case "View departments, roles, employees":
        viewAll();
        break;
      case "Add a new employee":
        addEmployee(); 
        break;
      case "Add a new role":
          addRole(); 
          break;    
      case "Add a new department":
          addDepartment(); 
          break;
      case "Update an employee role":
        updateEmployeeRole();
        break;
      case "Delete a department":
        deleteDepartment();
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

function addEmployee(){
  connection.query("SELECT * FROM role", function(err, res) { 
    
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
      name: "role",
      type: "list",
      message: "What is the employee's role?",
      choices: res.map((role) => {
        return { name: role.title, value: role.id};
      }),
    },
  ]).then(function(answer){
    connection.query("INSERT INTO employee SET ?", 
    {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: answer.role
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

function addDepartment(){
  inquirer.prompt([
    {
      name: "department",
      type: "input",
      message: "What is the name of the new department?",
      validateString
    }
  ]).then(function(answer) {
      
      connection.query(
      "INSERT INTO department SET ?",
      {
          department_name: answer.department
      }, 
      function(err, results){
          if (err) throw err;
          console.log("You have successfully added a new department!");
          viewAllDepartment();
          selectEmployeeAction();
      }
      )
  });
};

function viewAllDepartment(){
  connection.query("SELECT * FROM department", function(err,res){
    if (err) throw err;
    console.table(res);
  });
};  

function getAllRoles(callback){
  connection.query("SELECT * FROM role", function(err,res){
    callback(err, res);
  });
};

function viewAllRoles(){
  connection.query("SELECT * FROM role", function(err,res){
    if (err) throw err;
    console.table(res);
  });
}

function addRole(){
  
  connection.query("SELECT * FROM department", function(err,res){

    inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "What is the role that you want to add?",
      validate: validateString
    },
    {
      name: "salary", 
      type: "input", 
      message: "What is the salary for this role?",
      validate: validateSalary
    },
    {
      name: "department",
      type: "list",
      message: "Which department does this role belong?",
      choices: res.map((department) => {
        return {name: department.department_name, value:department.id };
      }),
    }
  ]).then(function(answer) {
    connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.department
    }, 
    function(err, results){
      if (err) throw err;
      console.log("You have successfully added a new role!"); 
      viewAllRoles();
      selectEmployeeAction();
    }
    )
  });
});
};

function updateEmployeeRole(){
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
            const rawquery = connection.query(
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

function deleteDepartment(){
  connection.query("SELECT * FROM department", function(err,res){
    if(err) throw err;

    inquirer.prompt([
      {
        name: "department",
        type: "list",
        message: "What department would you like to delete?",
        choices: res.map((department) => {
          return { name: department.department_name, value: department.id};
        }),
      }
    ]).then(function(answer){
        
        connection.query("DELETE FROM department WHERE ?",
        {
            id: answer.department
        }, 
        function(err, res){
            if (err) throw err;
            console.log("You have successfully deleted a department!");
            viewAllDepartment();
            selectEmployeeAction();
        });
    });
  });
}