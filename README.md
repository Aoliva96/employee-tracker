# employee-tracker

## Project Description

A study in creating a command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## Contents

- [Introduction](#introduction)
- [Problem](#problem)
- [Solution](#solution)
- [Usage](#usage)
- [Deployment](#deployment)
- [Collaborators](#collaborators)
- [Resources](#resources)
- [License](#License)

## Introduction

For this project I set out to create a Node.js application for managing a database of employee information for a fictional business. To accomplish this, I set out to utilize Inquirer to query for user input, and mySQL for database management.

## Problem

I was given the following requirements to create this project from scratch:

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Solution

I rectified the above problems in the following way:

- I created the base file structure for a Node app that utilizes a mySQL database
- I populated both .sql files to ensure the database had the proper structure and placeholder data.
- I developed functionality in script.js to properly connect to the database, manipulate it, and prompt the user for input per the requirements.
- I added an extra npm package, Chalk, that I used to help style the prompt text and to provide a clean and legible UI.
- I also added a few extra features including:
- Adding an 'Exit' prompt option to close the application.
- Adding an option for a newly added employee or role to have the manager's id set to 'Same' or 'None' in addition to the available managers.

## Usage

Assuming you already have mySQL installed, start by setting up the database. Start the mySQL shell, run `sql source db/schema.sql;` and `sql source db/seeds.sql;`, then use `sql show databases;` and `sql show tables;` to ensure the database "employee_db" was created correctly. Next, create a .env file following the template in .env.EXAMPLE, then run `npm install` and `npm start` to initialize the application in your terminal of choice. Congrats! The app should now be running properly, simply follow the prompts to easily manage your mock employee database.

In the future I plan on adding additional features, such as the ability to delete items or modify values in the database. For now, dropping the database and rerunning both schema and seed files will reset the app back to default. If you wish to change any of the default values, simply edit the seeds.sql file in the db folder as desired.

Click the link below for a quick demo of the project's functionality:

[Project Demo Link](https://app.screencastify.com/v3/watch/LUvs9M5mTUb78ecmocIn)

## Deployment

[Link to the GitHub repo for this project](https://github.com/Aoliva96/employee-tracker)

## Collaborators

I received assistance from my bootcamp instructor Nick Gambino in solving various bugs relating to the prompt functionality and knowing which features to prioritize.

## Resources

See the links below for some of the resources I used during this project:

[MDN | Switch Statements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)

[GeeksForGeeks | MySQL Node App Tutorial](https://www.geeksforgeeks.org/node-js-connect-mysql-with-node-app/)

[Chalk](https://github.com/chalk/chalk)

I also utilized GitHub Copilot to illustrate code concepts and provide syntax suggestions.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project utilizes the standard MIT License.
