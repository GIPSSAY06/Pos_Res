import { useEffect, useState } from 'react';
import './ProductoPanel.css';

export default function ProductoPanel() {
  const [productos, setProductos] = useState([]);
  const [adminName, setAdminName] = useState('Admin');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('adminName');
    if (nombreGuardado) {
      setAdminName(nombreGuardado);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/api/productos') // Asegúrate que esta ruta existe
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
        setIsLoading(false);
      });
  }, []);

  const toggleVisible = async (id, currentVisible) => {
    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id}/visibles`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible }),
      });

      if (res.ok) {
        setProductos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, visible: !currentVisible } : p
          )
        );
      }
    } catch (error) {
      console.error('Error al cambiar visibilidad:', error);
    }
  };

  const agregarProducto = async () => {
    const nombre = prompt('Nombre del producto:');
    const precio = prompt('Precio:');
    const categoria_id = prompt('ID de categoría (1 = Alimentos, 2 = Bebidas):');

    if (!nombre || !precio) return;

    try {
      const res = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          precio: parseFloat(precio),
          categoria_id: parseInt(categoria_id) || null,
        }),
      });

      if (!res.ok) throw new Error('Error al agregar producto');

      const nuevoProducto = await res.json();
      setProductos((prev) => [...prev, nuevoProducto]);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  if (isLoading) return <p>Cargando productos...</p>;

  return (
    <section className="producto-panel">
      <h2 className="panel-title">Productos en Inventario</h2>
      <p>Bienvenido, {adminName}</p>

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
                <td>${Number(precio).toFixed(2)}</td>
                <td>{visible ? 'Sí' : 'No'}</td>
                <td>
                  <button
                    onClick={() => toggleVisible(id, visible)}
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
