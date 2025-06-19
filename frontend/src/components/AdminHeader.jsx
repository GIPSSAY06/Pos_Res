import { useNavigate } from 'react-router-dom';
import './HeaderMesero.css'; 



export default function AdminHeader({ nombre }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('pin');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
    localStorage.removeItem('adminName');
    navigate('/');
  };

  return (
    <div className="header-mesero">

      <button className="btn-link" onClick={() => navigate('/admin')}>
        PRODUCTOS
      </button>
      <button className="btn-link" onClick={() => navigate('/admin/mapa')}>
        MAPA
      </button>
      <button className="btn-link" onClick={() => navigate('/ordenes-abiertas')}>
        ÓRDENES ABIERTAS
      </button>
      <button className="btn-link" onClick={() => navigate('/usuarios')}>
        USUARIOS
      </button>
      <button className="btn-link" onClick={() => navigate('/corte-dia')}>
        CORTE DEL DÍA
      </button>
      

      <div className="usuario-dropdown">
        <span className="usuario-nombre">{nombre}</span>
        <div className="dropdown-contenido" style={{ right: 0, left: 'auto' }}>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}
