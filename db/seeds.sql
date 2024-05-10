USE employee_db;

INSERT INTO department (name)
VALUES ('management'),
    ('engineering'),
    ('design'),
    ('marketing'),
    ('sales'),
    ('finance');

INSERT INTO role (title, salary, department_id)
VALUES ('manager', 120000, 1),
    ('engineer', 95000, 2),
    ('designer', 85000, 3),
    ('analyst', 75000, 4),
    ('marketer', 65000, 4),
    ('salesperson', 50000, 5),
    ('accountant', 80000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('David', 'Lynch', 1, NULL),
    ('Dale', 'Cooper', 1, NULL),
    ('Laura', 'Palmer', 1, NULL),
    ('Donna', 'Hayward', 2, 1),
    ('Leland', 'Palmer', 2, 1),
    ('Denise', 'Bryson', 3, 1),
    ('Josie', 'Packard', 3, 1),
    ('Lucy', 'Moran', 4, 2),
    ('James', 'Hurley', 4, 2),
    ('Norma', 'Jennings', 5, 2),
    ('Leo', 'Johnson', 5, 2),
    ('Nadine', 'Hurley', 6, 3),
    ('Robert', 'Jones', 6, 3),
    ('Benjamin', 'Horne', 7, 3),
    ('Betty', 'Briggs', 7, 3);

