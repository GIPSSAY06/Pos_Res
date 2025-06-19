import { useNavigate } from 'react-router-dom';
import './HeaderMesero.css'; // puedes reutilizar el mismo CSS si ya existe

export default function HeaderOrdenMesero({ nombre, orden, mesaId }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('pin');
    localStorage.removeItem('rol');
    navigate('/');
  };

  const volverAlMapa = () => {
    const hayOrden = orden && Object.keys(orden).length > 0;

    const confirmar = window.confirm(
      hayOrden
        ? 'Hay productos en la orden que no han sido registrados.\nSi sales, se perderán y la mesa volverá a estar disponible.\n\n¿Deseas continuar?'
        : '¿Seguro que deseas volver al mapa? La mesa volverá a estar disponible.'
    );

    if (confirmar) {
      // Descomenta esto si quieres liberar la mesa vía backend
      /*
      fetch(`http://localhost:3000/api/mesas/${mesaId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'disponible' }),
      })
        .then(res => {
          if (!res.ok) throw new Error('No se pudo actualizar el estado de la mesa');
          return res.json();
        })
        .catch(err => console.error('Error al liberar la mesa:', err));
      */

      navigate('/mesero');
    }
  };

  return (
    <div className="header-mesero">
      <button className="btn-link" onClick={volverAlMapa}>
        VOLVER AL MAPA
      </button>

      <div className="usuario-dropdown">
        <span className="usuario-nombre">{nombre}</span>
        <div className="dropdown-contenido">
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}
