CREATE DATABASE POS_REST;
USE pos_rest;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  pin VARCHAR(10) NOT NULL,
  role ENUM('admin', 'mesero') NOT NULL
);

-- Datos de prueba
INSERT INTO users (name, pin, role) VALUES
('Admin', '1234', 'admin'),
('Mesero Juan', '5678', 'mesero');
SELECT*FROM users;


