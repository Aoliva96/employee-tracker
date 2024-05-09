USE employee_db;

INSERT INTO department (name)
VALUES ('Management'),
    ('Engineering'),
    ('Sales'),
    ('Marketing'),
    ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 80000, 1),
    ('Engineer', 65000, 2),
    ('Salesperson', 30000, 3),
    ('Analyst', 45000, 2),
    ('Designer', 55000, 1),
    ('Marketer', 50000, 4),
    ('Accountant', 60000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('James', 'Scott', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Michael', 'Johnson', 2, 1),
    ('Emily', 'Davis', 3, 2),
    ('Christopher', 'Taylor', 3, 2),
    ('David', 'Wilson', 3, 2),
    ('Sarah', 'Brown', 1, NULL),
    ('Jennifer', 'Miller', 2, 1),
    ('Robert', 'Jones', 2, 1),
    ('Jessica', 'Anderson', 3, 2);

