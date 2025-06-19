import React, { useEffect, useState } from 'react';
import HeaderOrdenMesero from '../components/HeaderOrdenPage';
import AdminHeader from '../components/AdminHeader';
import { useNavigate } from 'react-router-dom';
import './OrdenesAbiertas.css';

export default function OrdenesAbiertas() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRol = localStorage.getItem('rol');
    const pin = sessionStorage.getItem('pin');

    if (storedRol === 'admin') {
      setRol('admin');
      const adminName = localStorage.getItem('adminName') || 'Administrador';
      setNombreUsuario(adminName);
    } else if (pin) {
      setRol('mesero');
      fetch(`http://localhost:3000/api/usuario/${pin}`)
        .then(res => {
          if (!res.ok) throw new Error(`Error ${res.status}`);
          return res.json();
        })
        .then(data => {
          setNombreUsuario(data.name || 'Mesero desconocido');
        })
        .catch(() => {
          setNombreUsuario('Mesero desconocido');
        });
    } else {
      // No hay sesión válida, redirigir a login
      navigate('/');
    }
  }, [navigate]);

  // Ejemplo de órdenes abiertas (simula datos reales)
  const [ordenes, setOrdenes] = useState([
    {
      id: 1,
      mesa: 'Mesa 1',
      productos: [
        { id: 101, nombre: 'Café' },
        { id: 102, nombre: 'Croissant' },
      ],
    },
    {
      id: 2,
      mesa: 'Mesa 2',
      productos: [
        { id: 103, nombre: 'Té' },
      ],
    },
  ]);

  const reabrirOrden = (id) => {
    alert(`Reabriendo orden con id ${id} para agregar productos`);
  };

  const cerrarCuenta = (id) => {
    if (window.confirm('¿Cerrar cuenta y mandar ticket a imprimir?')) {
      setOrdenes(ordenes.filter(o => o.id !== id));
      alert(`Orden ${id} cerrada`);
    }
  };

  return (
    <>
      {rol === 'mesero' && (
        <HeaderOrdenMesero nombre={nombreUsuario} orden={ordenes[0]} mesaId={ordenes[0]?.mesa || 'N/A'} />
      )}
      {rol === 'admin' && (
        <AdminHeader nombre={nombreUsuario} />
      )}

      <div className="ordenes-container">
        <h1>Órdenes Abiertas</h1>
        {ordenes.length === 0 ? (
          <p>No hay órdenes abiertas.</p>
        ) : (
          <ul>
            {ordenes.map(orden => (
              <li key={orden.id}>
                <div>
                  <p><strong>Mesa:</strong> {orden.mesa}</p>
                  <p><strong>Productos:</strong> {orden.productos.map(p => p.nombre).join(', ')}</p>
                </div>
                <div>
                  <button className="reabrir" onClick={() => reabrirOrden(orden.id)}>
                    Reabrir
                  </button>
                  <button className="cerrar" onClick={() => cerrarCuenta(orden.id)}>
                    Cerrar cuenta
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
