DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
	id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL 
);

CREATE TABLE role (
	id INTEGER PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL, 
	salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL
);

CREATE TABLE employee (
	id INTEGER PRIMARY KEY NOT NULL,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER 
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;