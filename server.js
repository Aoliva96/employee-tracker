const inquirer = require("inquirer");
const dotenv = require("dotenv");
const mysql2 = require("mysql2");

// Load terminal styles
const chalk = require("chalk");

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
  console.log(
    chalk.green(`[ Connected to database `) +
      chalk.blueBright(`${DB_NAME}`) +
      chalk.green(` ]`)
  ),
  console.log(""),
  console.log(chalk.green("[ Starting Employee Tracker... ]"))
);
db.connect((err) => {
  if (err)
    throw (
      err &&
      console.error(
        chalk.red(`[ Error connecting to database ${DB_NAME} ]`, err)
      )
    );
});

// Function to start the application
async function init() {
  console.log("=============================================");
  // Prompt user for input
  inquirer
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
          "[ Exit ]",
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
        case "[ Exit ]":
          console.log("=============================================");
          console.log(chalk.green("[ Closing application... ]"));
          console.log("");
          console.log(chalk.green("[ Have a nice day ]"));
          process.exit();
        default:
          console.log(chalk.red("Invalid selection, please try again"));
          init();
      }
    });
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
  const sql = `SELECT id, name AS department FROM department`;
  const message = "Viewing all departments...";
  const departments = await queryDatabase(sql);

  console.log(chalk.green(`[ `) + chalk.green(message) + chalk.green(` ]`));
  console.table(departments);
  init();
}

// Function to query the db for all roles
async function viewAllRoles() {
  const sql = `SELECT role.id, role.title AS job_title, department.name AS department, role.salary 
  FROM role
  INNER JOIN department ON role.department_id = department.id
`;
  const message = "Viewing all roles...";
  const roles = await queryDatabase(sql);

  console.log(chalk.green(`[ `) + chalk.green(message) + chalk.green(` ]`));
  console.table(roles);
  init();
}

// Function to query the db for all employees
async function viewAllEmployees() {
  const sql = `
  SELECT 
    e1.id, 
    e1.first_name, 
    e1.last_name, 
    role.title AS job_title, 
    department.name AS department, 
    role.salary,
    CONCAT(e2.first_name, ' ', e2.last_name) AS manager
  FROM employee e1
  LEFT JOIN role ON e1.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee e2 ON e1.manager_id = e2.id
`;
  const message = "Viewing all employees...";
  const employees = await queryDatabase(sql);

  console.log(chalk.green(`[ `) + chalk.green(message) + chalk.green(` ]`));
  console.table(employees);
  init();
}

// Function to query the db to add a department
async function addDepartment() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "Enter a name for the new department:",
      name: "name",
    },
  ]);

  const sql = "INSERT INTO department (name) VALUES (?)";
  const values = [answers.name];
  const message = `Added ${answers.name} to department list.`;

  await queryDatabase(sql, values);
  console.log(chalk.green(`[ `) + chalk.green(message) + chalk.green(` ]`));
  init();
}

// Function to query the db to add a role
async function addRole() {
  const getDepartments = "SELECT * FROM department";
  const departments = await queryDatabase(getDepartments);
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "Enter a name for the new role:",
      name: "name",
    },
    {
      type: "input",
      message: "Enter a salary for the new role:",
      name: "salary",
    },
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

  const selectedDepartment = departments.find(
    (department) => department.id === answers.department
  );

  const sql =
    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
  const values = [answers.name, answers.salary, answers.department];
  const message = `Added the ${answers.name} role to the ${selectedDepartment.name} department.`;

  await queryDatabase(sql, values);
  console.log(chalk.green(`[ `) + chalk.green(message) + chalk.green(` ]`));
  init();
}

// Function to query the db to add an employee
async function addEmployee() {
  const getRoles = "SELECT * FROM role";
  const getManagers = "SELECT * FROM employee WHERE role_id = 1";
  const roles = await queryDatabase(getRoles);
  const managers = await queryDatabase(getManagers);
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
      message: "Assign the new employee to a role:",
      name: "role",
      choices: [
        ...roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      ],
    },
    {
      type: "list",
      message: "Assign the new employee to a manager:",
      name: "manager",
      choices: [
        ...managers.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
        {
          name: "No manager",
          value: null,
        },
      ],
    },
  ]);

  const selectedRole = roles.find((role) => role.id === answers.role);
  const selectedManager = managers.find(
    (employee) => employee.id === answers.manager
  );

  const sql =
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
  const values = [
    answers.first_name,
    answers.last_name,
    answers.role,
    answers.manager,
  ];
  const message = [
    `New ${selectedRole.title}, ${answers.first_name} ${answers.last_name} added to employee list.`,
  ];

  if (answers.manager === null) {
    values[3] = null;
    message.push("No manager assigned.");
  } else {
    message.push(
      `Assigned to ${selectedManager.first_name} ${selectedManager.last_name}'s team.`
    );
  }

  await queryDatabase(sql, values);
  console.log(
    chalk.green(`[ `) + chalk.green(message.join(" ")) + chalk.green(` ]`)
  );
  init();
}

// Function to query the db to update an employee's role
async function updateEmployeeRole() {
  const getRoles = "SELECT * FROM role";
  const getEmployees = "SELECT * FROM employee";
  const getManagers = "SELECT * FROM employee WHERE role_id = 1";
  const roles = await queryDatabase(getRoles);
  const employees = await queryDatabase(getEmployees);
  const managers = await queryDatabase(getManagers);
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
    {
      type: "list",
      message: "Select the employee's new manager:",
      name: "manager",
      choices: [
        ...managers.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
        {
          name: "Keep same manager",
          value: "same",
        },
        {
          name: "No manager",
          value: null,
        },
      ],
    },
  ]);

  const selectedRole = roles.find((role) => role.id === answers.role);
  const selectedEmployee = employees.find(
    (employee) => employee.id === answers.employee
  );
  const selectedManager = managers.find(
    (employee) => employee.id === answers.manager
  );

  const sqlArray = ["UPDATE employee", "SET role_id = ?"];
  const values = [answers.role];
  const message = [
    `Updated ${selectedEmployee.first_name} ${selectedEmployee.last_name}'s role to`,
  ];

  if (answers.manager === "same") {
    sqlArray.push("WHERE id = ?");
    values.push(answers.employee);
    message.push(`${selectedRole.title}.`);
  } else if (answers.manager === null) {
    sqlArray.push(", manager_id = NULL", "WHERE id = ?");
    values.push(answers.employee);
    message.push(`${selectedRole.title}, no manager assigned.`);
  } else {
    sqlArray.push(", manager_id = ?", "WHERE id = ?");
    values.push(selectedManager.id, answers.employee);
    message.push(
      `${selectedRole.title} on ${selectedManager.first_name} ${selectedManager.last_name}'s team.`
    );
  }

  const sql = sqlArray.join(" ");
  await queryDatabase(sql, values);
  console.log(
    chalk.green(`[ `) + chalk.green(message.join(" ")) + chalk.green(` ]`)
  );
  init();
}

// Start application
init();
