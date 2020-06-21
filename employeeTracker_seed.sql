USE employeeTracker_db;

INSERT INTO department (department_name)
	VALUES ("Sales"), ("Marketing"), ("Human Resource"), ("Engineer"), ("Operations"), ("Customer Service"), ("Legal"), ("Finance"), ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer Staff A", 95000, 4); 

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Associate", 70000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("HR Recruiter", 70000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Office Manager", 50000, 5);

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Service Support", 52000, 6);

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Associate", 54000, 2);


INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Becky",  "White", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Carise",  "Wyatt", 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Dan",  "Young", 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Elle",  "Poon", 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Hank",  "Lar", 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Frank",  "Moon", 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Geraldine",  "Nune", 7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT first_name, last_name, title, department_name, salary
FROM department
JOIN role ON department.id =role.department_id
JOIN employee ON role.department_id = employee.role_id