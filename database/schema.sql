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


CREATE DATABASE Restaurante;
USE Restaurante;

-- Categorías: solo alimentos y bebidas
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);


-- aqui empieza lo nuevo
-- Productos sin subcategorías
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

INSERT INTO categorias (nombre) VALUES 
('Alimentos'),
('Bebidas');

-- Entradas, sopas, platos fuertes, postres
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Orden de sopes', 55.00, 1),
('Queso fundido de la olla', 90.00, 1),
('Orden de guacamole', 80.00, 1),
('Papas a la francesa', 70.00, 1),
('Orden de frijoles refritos', 55.00, 1),
('Consomé de pollo', 60.00, 1),
('Consomé de res', 55.00, 1),
('Sopa de fideo', 55.00, 1),
('Caldo de frijol', 40.00, 1),
('Plato de arroz', 55.00, 1),
('Conejo a las brazas', 210.00, 1),
('Conejo al ajillo', 250.00, 1),
('Pollo a la carbonera', 250.00, 1),
('Pollo con mole rojo', 200.00, 1),
('Pollo asado', 170.00, 1),
('Carne tampiqueña', 230.00, 1),
('Bistec asado', 200.00, 1),
('Enchiladas verdes', 150.00, 1),
('Enmoladas', 180.00, 1),
('Enchiladas suizas', 150.00, 1),
('Enchiladas a la carbonera', 180.00, 1),
('Enchiladas coloradas', 150.00, 1),
('Chilaquiles verdes', 135.00, 1),
('Chilaquiles rojos', 135.00, 1),
('Pay de limón', 45.00, 1),
('Pan de elote', 40.00, 1),
('Pay de fresa', 45.00, 1),
('Pay de zarzamora', 45.00, 1);

INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Refresco', 40.00, 2),
('Limonada', 45.00, 2),
('Naranjada', 55.00, 2),
('Mojito', 65.00, 2),
('Mojito tradicional', 50.00, 2),
('Piña colada', 65.00, 2),
('Vampiro', 70.00, 2),
('Cosmo politan', 80.00, 2),
('Jarra de agua de limón', 120.00, 2),
('Jarra de agua naranja', 150.00, 2),
('Cerveza Modelo', 45.00, 2),
('Corona', 40.00, 2),
('Victoria', 40.00, 2),
('Bohemia', 50.00, 2);

SELECT p.id, p.nombre AS producto, p.precio, c.nombre AS categoria
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
ORDER BY c.nombre, p.nombre;


