import { useEffect, useState } from 'react';
import './ProductoPanel.css';

export default function ProductoPanel() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Hamburguesa', precio: 120, visible: true },
    { id: 2, nombre: 'Papas Fritas', precio: 50, visible: true },
    { id: 3, nombre: 'Refresco', precio: 30, visible: true },
  ]);

  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('adminName');
    if (nombreGuardado) {
      setAdminName(nombreGuardado);
    }
  }, []);

  const toggleVisible = (id) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, visible: !p.visible } : p
      )
    );
  };

  const agregarProducto = () => {
    const nuevoId = productos.length + 1;
    const nuevoProducto = {
      id: nuevoId,
      nombre: `Producto ${nuevoId}`,
      precio: 0,
      visible: true,
    };
    setProductos((prev) => [...prev, nuevoProducto]);
  };

  return (
    <section className="producto-panel">
      <h2 className="panel-title">Productos en Inventario</h2>
      <button onClick={agregarProducto} className="btn-add">
        Añadir producto
      </button>

      <div className="table-wrapper">
        <table className="productos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Visible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(({ id, nombre, precio, visible }) => (
              <tr key={id} className={!visible ? 'no-visible' : ''}>
                <td>{nombre}</td>
                <td>${precio}</td>
                <td>{visible ? 'Sí' : 'No'}</td>
                <td>
                  <button
                    onClick={() => toggleVisible(id)}
                    className="btn-toggle"
                  >
                    {visible ? 'Ocultar' : 'Mostrar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
