USE employeeTracker_db;

INSERT INTO department (department_name)
	VALUES ("Customer Service"), ("Engineer"), ("Finance"), ("Human Resource"), ("IT"), ("Legal"), ("Marketing"), ("Operations"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 95000, 2); 

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Specialist", 70000, 9);

INSERT INTO role (title, salary, department_id)
VALUES ("HR Specialist", 70000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Office Manager", 50000, 8);

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Service Specialist", 52000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Specialist", 54000, 7);

INSERT INTO role (title, salary, department_id)
VALUES ("Finance Specialist", 54000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("IT Specialist", 64000, 5);

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 164000, 6);


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
VALUES ("Ian",  "McKennedy", 7);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Josephine",  "Miller", 8);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Kyle",  "Thorn", 9);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT first_name, last_name, title, department_name, salary
FROM department
JOIN role ON department.id =role.department_id
JOIN employee ON role.id = employee.role_id;

SELECT id FROM role;
