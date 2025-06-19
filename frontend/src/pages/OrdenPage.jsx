import { useEffect, useState } from 'react';
import ProductoCard from "../components/ProductoCard";
import NotaModal from "../components/NotaModal";
import './OrdenPage.css';
import HeaderMesero from '../components/HeaderOrdenPage';
import AdminHeader from '../components/AdminHeader'; // 👈 importa AdminHeader
import { useNavigate, useLocation } from 'react-router-dom';

export default function OrdenPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mesaId, setMesaId] = useState(null);
  const [alimentos, setAlimentos] = useState([]);
  const [orden, setOrden] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rol, setRol] = useState('mesero'); // 👈 default como mesero

  useEffect(() => {
    const storedRol = localStorage.getItem('rol') || 'mesero';
    setRol(storedRol);

    if (storedRol === 'admin') {
      const adminName = localStorage.getItem('adminName') || 'Admin';
      setNombreUsuario(adminName);
    } else {
      const pin = sessionStorage.getItem('pin');
      if (!pin) {
        navigate('/');
        return;
      }

      fetch(`http://localhost:3000/api/usuario/${pin}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((data) => {
          setNombreUsuario(data.name || 'Mesero desconocido');
        })
        .catch(() => {
          setNombreUsuario('Mesero desconocido');
        });
    }
  }, [navigate]);

  useEffect(() => {
    const { mesaId } = location.state || {};
    if (mesaId) {
      setMesaId(mesaId);
    } else {
      navigate('/');
    }

    fetch('http://localhost:3000/alimentos')
      .then(res => res.json())
      .then(data => setAlimentos(data))
      .catch(err => console.error('Error al obtener alimentos:', err));
  }, [navigate, location.state]);

  const cerrarSesion = () => {
    if (rol === 'admin') {
      localStorage.removeItem('pin');
      localStorage.removeItem('rol');
      localStorage.removeItem('token');
      localStorage.removeItem('adminName');
    } else {
      sessionStorage.removeItem('pin');
    }
    navigate('/');
  };

  const abrirModal = (alimento) => {
    setAlimentoSeleccionado(alimento);
    setMostrarModal(true);
  };

  const agregarAlimentoConNota = (nota) => {
    const alimento = alimentoSeleccionado;
    setOrden(prev => {
      const actual = prev[alimento.id] || [];
      return {
        ...prev,
        [alimento.id]: [
          ...actual,
          {
            ...alimento,
            cantidad: 1,
            nota: nota?.trim() || null
          }
        ]
      };
    });
    setMostrarModal(false);
    setAlimentoSeleccionado(null);
  };

  const total = Object.values(orden).flat().reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const alimentosFiltrados = alimentos.filter(a => {
    const coincideBusqueda = a.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro =
      filtro === 'todos' ||
      (filtro === 'bebidas' && a.tipo === 'bebida') ||
      (filtro === 'alimentos' && a.tipo === 'alimento');
    return coincideBusqueda && coincideFiltro;
  });

  return (
    <>
      {/* 👇 Renderizar encabezado según el rol */}
      {rol === 'admin' ? (
        <AdminHeader nombre={nombreUsuario} />
      ) : (
        <HeaderMesero nombre={nombreUsuario}>
          <button onClick={cerrarSesion} className="btn-cerrar-sesion">
            Cerrar sesión
          </button>
        </HeaderMesero>
      )}

      {/* ... resto de la página */}
      <div className="orden-layout">
        {/* Panel izquierdo */}
        <div className="orden-resumen">
          <h2>Orden Mesa: {mesaId}</h2>
          {Object.keys(orden).length === 0 ? (
            <p>No hay productos aún.</p>
          ) : (
            <ul>
              {Object.entries(orden).flatMap(([id, items]) =>
                items.map((item, index) => (
                  <li key={`${id}-${index}`} className="item-resumen">
                    <div className="fila-producto">
                      <span>{item.nombre}</span>
                      <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                    {item.nota && <div className="nota">Nota: {item.nota}</div>}
                  </li>
                ))
              )}
            </ul>
          )}
          <div className="total">Total: ${total.toFixed(2)}</div>
          <button className="btn-registrar">Registrar Orden</button>
        </div>

        {/* Panel derecho */}
        <div className="orden-productos">
          <div className="barra-controles">
            <button className={filtro === 'alimentos' ? 'btn-filtro activo' : 'btn-filtro'} onClick={() => setFiltro('alimentos')}>Alimentos</button>
            <button className={filtro === 'bebidas' ? 'btn-filtro activo' : 'btn-filtro'} onClick={() => setFiltro('bebidas')}>Bebidas</button>
            <button className={filtro === 'todos' ? 'btn-filtro activo' : 'btn-filtro'} onClick={() => setFiltro('todos')}>Todos</button>
            <input type="text" placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="input-busqueda" />
          </div>

          <div className="productos-grid">
            {alimentosFiltrados.map(alimento => (
              <ProductoCard key={alimento.id} alimento={alimento} onClick={abrirModal} />
            ))}
          </div>
        </div>
      </div>

      {mostrarModal && (
        <NotaModal
          onClose={() => setMostrarModal(false)}
          onSave={agregarAlimentoConNota}
          alimento={alimentoSeleccionado}
        />
      )}
    </>
  );
}
