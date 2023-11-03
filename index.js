const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'employee_db', // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Exiting the application');
          db.end(); // Close the database connection
          process.exit();
          break;
      }
    });
}

// Function to display data in a table
function displayTable(results) {
  console.log('\n');
  console.table(results);
  startApp();
}

// Function to view all departments
function viewDepartments() {
  const query = 'SELECT * FROM department';
  db.query(query, (err, results) => {
    if (err) throw err;
    displayTable(results);
  });
}

// Function to view all roles
function viewRoles() {
  const query = 'SELECT * FROM role';
  db.query(query, (err, results) => {
    if (err) throw err;
    displayTable(results);
  });
}

// Function to view all employees
function viewEmployees() {
  const query = 'SELECT * FROM employee';
  db.query(query, (err, results) => {
    if (err) throw err;
    displayTable(results);
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      const query = 'INSERT INTO department (name) VALUES (?)';
      db.query(query, [answer.name], (err) => {
        if (err) throw err;
        console.log('Department added successfully');
        startApp();
      });
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:',
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'Enter the department ID for the role:',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      db.query(query, [answer.title, answer.salary, answer.department_id], (err) => {
        if (err) throw err;
        console.log('Role added successfully');
        startApp();
      });
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: "Enter the employee's first name:",
      },
      {
        name: 'last_name',
        type: 'input',
        message: "Enter the employee's last name:",
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'Enter the role ID for the employee:',
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'Enter the manager ID for the employee (or leave it empty if no manager):',
      },
    ])
    .then((answer) => {
      const query =
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      db.query(
        query,
        [answer.first_name, answer.last_name, answer.role_id, answer.manager_id],
        (err) => {
          if (err) throw err;
          console.log('Employee added successfully');
          startApp();
        }
      );
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
  const query = 'SELECT id, first_name, last_name FROM employee';
  db.query(query, (err, results) => {
    if (err) throw err;
    const employees = results.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    inquirer
      .prompt([
        {
          name: 'employee_id',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees,
        },
        {
          name: 'role_id',
          type: 'input',
          message: 'Enter the new role ID for the employee:',
        },
      ])
      .then((answer) => {
        const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
        db.query(updateQuery, [answer.role_id, answer.employee_id], (err) => {
          if (err) throw err;
          console.log('Employee role updated successfully');
          startApp();
        });
      });
  });
}
