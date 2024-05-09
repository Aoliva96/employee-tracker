const inquirer = require("inquirer");
const dotenv = require("dotenv");
const mysql2 = require("mysql2");

// Load environment variables
dotenv.config();
const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Connect to db specified in the .env file
const db = mysql2.createConnection(
  {
    host: "localhost",
    port: 3306,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  },
  console.log(`You are connected to the ${DB_NAME} database`)
);
db.connect((err) => {
  if (err) throw err;
});

// Function to start the application
async function init() {
  try {
    // Prompt user for input
    const answers = await inquirer
      .prompt([
        {
          type: "list",
          message: "Please select an action to perform:",
          name: "action",
          choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit",
          ],
        },
      ])
      .then(function (response) {
        // Perform user's chosen action or exit
        switch (response.action) {
          case "View all departments":
            viewAllDepartments();
            break;
          case "View all roles":
            viewAllRoles();
            break;
          case "View all employees":
            viewAllEmployees();
            break;
          case "Add a department":
            addDepartment();
            break;
          case "Add a role":
            addRole();
            break;
          case "Add an employee":
            addEmployee();
            break;
          case "Update an employee role":
            updateEmployeeRole();
            break;
          case "Exit":
            console.log("Closing application");
            process.exit();
          default:
            console.log("Invalid selection, please try again");
            init();
        }
      });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Function to query the database
function queryDatabase(sql, args) {
  return new Promise((resolve, reject) => {
    db.query(sql, args, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Function to query the db for all departments
async function viewAllDepartments() {
  const sql = "SELECT * FROM department";
  const departments = await queryDatabase(sql);
  return departments;
}

// Function to query the db for all roles
async function viewAllRoles() {
  const sql = "SELECT * FROM role";
  const roles = await queryDatabase(sql);
  return roles;
}

// Function to query the db for all employees
async function viewAllEmployees() {
  const sql = "SELECT * FROM employee";
  const employees = await queryDatabase(sql);
  return employees;
}

// Function to query the db to add a department
async function addDepartment() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "Enter the new department's name:",
      name: "name",
    },
  ]);

  const sql = "INSERT INTO department (name) VALUES (?)";
  await queryDatabase(sql, [answers.name]);
  console.log(`Added department ${answers.name}.`);
  init();
}

// Function to query the db to add a role
async function addRole() {
  const departments = await viewAllDepartments();

  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "Enter the new role's name:",
      name: "title",
    },
    { type: "input", message: "Enter the new role's salary:", name: "salary" },
    {
      type: "list",
      message: "Assign the new role to a department:",
      name: "department",
      choices: departments.map((department) => ({
        name: department.name,
        value: department.id,
      })),
    },
  ]);

  const sql =
    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
  await queryDatabase(sql, [answers.title, answers.salary, answers.department]);
  console.log(`Added role ${answers.title}.`);
  init();
}

// Function to query the db to add an employee
async function addEmployee() {
  const roles = await viewAllRoles();
  const employees = await viewAllEmployees();
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "Enter the new employee's first name:",
      name: "first_name",
    },
    {
      type: "input",
      message: "Enter the new employee's last name:",
      name: "last_name",
    },
    {
      type: "list",
      message: "Select the new employee's role:",
      name: "role",
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: "list",
      message: "Select the new employee's manager:",
      name: "manager",
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
  ]);

  const sql =
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
  await queryDatabase(sql, [
    answers.first_name,
    answers.last_name,
    answers.role,
    answers.manager,
  ]);
  console.log(`Added employee ${answers.first_name} ${answers.last_name}.`);
  init();
}

// Function to query the db to update an employee's role
async function updateEmployeeRole() {
  const employees = await viewAllEmployees();
  const roles = await viewAllRoles();

  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "Select the employee to update:",
      name: "employee",
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
    {
      type: "list",
      message: "Select the employee's new role:",
      name: "role",
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
  ]);

  const sql = "UPDATE employee SET role_id = ? WHERE id = ?";
  await queryDatabase(sql, [answers.role, answers.employee]);
  console.log(`Updated ${answers.employee}'s role to ${answers.role}.`);
  init();
}

// Start application
init();
