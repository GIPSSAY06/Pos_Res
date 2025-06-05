import { useNavigate } from 'react-router-dom';
import './HeaderMesero.css';

export default function HeaderMesero({ nombre }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('pin');
    localStorage.removeItem('rol');
    navigate('/');
  };

  return (
    <div className="header-mesero">
      <button className="btn-link" onClick={() => navigate('/ordenes-abiertas')}>
        ÓRDENES ABIERTAS
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
