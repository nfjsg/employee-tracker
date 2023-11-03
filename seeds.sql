-- Insert sample departments
INSERT INTO department (name) VALUES
  ('HR'),
  ('Sales'),
  ('Engineering');

-- Insert sample roles
INSERT INTO role (title, salary, department_id) VALUES
  ('HR Manager', 60000, 1),
  ('Sales Manager', 70000, 2),
  ('Software Engineer', 80000, 3);

-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 3, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Tom', 'Johnson', 3, 1);
