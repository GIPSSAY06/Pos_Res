import React, { useEffect, useState } from 'react';
import HeaderOrdenMesero from '../components/HeaderOrdenPage';
import AdminHeader from '../components/AdminHeader';
import { useNavigate } from 'react-router-dom';
import './OrdenesAbiertas.css';

export default function OrdenesAbiertas() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rol, setRol] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
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
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => setNombreUsuario(data.name || 'Mesero desconocido'))
        .catch(() => setNombreUsuario('Mesero desconocido'));
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:3000/api/ordenes/abiertas')
      .then(res => res.json())
      .then(data => setOrdenes(data))
      .catch(err => console.error('Error al obtener órdenes abiertas:', err));
  }, []);

  const reabrirOrden = (ordenId, mesaId) => {
    navigate('/orden', { state: { ordenId, mesaId } });
  };

  const cerrarCuenta = async (id) => {
    if (window.confirm('¿Cerrar cuenta y mandar ticket a imprimir?')) {
      try {
        await fetch(`http://localhost:3000/api/ordenes/${id}/cerrar`, {
          method: 'PATCH'
        });
        alert(`Orden ${id} cerrada`);
        setOrdenes(prev => prev.filter(o => o.id !== id));
      } catch (err) {
        alert('Error al cerrar la cuenta');
      }
    }
  };

  return (
    <>
      {rol === 'mesero' && (
        <HeaderOrdenMesero
          nombre={nombreUsuario}
          orden={ordenes[0]}
          mesaId={ordenes[0]?.mesa || 'N/A'}
        />
      )}
      {rol === 'admin' && <AdminHeader nombre={nombreUsuario} />}

      <div className="ordenes-container">
        <h1>Órdenes Abiertas</h1>
        {ordenes.length === 0 ? (
          <p className="sin-ordenes">No hay órdenes abiertas.</p>
        ) : (
          <ul className="ordenes-lista">
            {ordenes.map((orden) => (
              <li key={orden.id} className="orden-card">
                <div className="orden-detalle">
                  <p><strong>Mesa:</strong> {orden.mesa || 'Sin asignar'}</p>
                  <p><strong>Productos:</strong> {orden.productos?.map(p => `${p.nombre} (x${p.cantidad || 1})`).join(', ') || '—'}</p>
                  {orden.notas && <p><strong>Notas:</strong> {orden.notas}</p>}
                  {orden.monto_extra > 0 && (
                    <p><strong>Extra:</strong> ${orden.monto_extra.toFixed(2)}</p>
                  )}
                </div>
                <div className="orden-acciones">
                  <button className="reabrir" onClick={() => reabrirOrden(orden.id, orden.mesa)}>
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
