// OrdenPage.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';
import HeaderMesero from '../components/HeaderMesero';
import AdminHeader from '../components/AdminHeader';
import './OrdenPage.css';

export default function OrdenPage() {
  const location = useLocation();
  const { ordenId: ordenIdDesdeRuta } = location.state || {};

  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [ordenId, setOrdenId] = useState(ordenIdDesdeRuta || null);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [notas, setNotas] = useState('');
  const [montoExtra, setMontoExtra] = useState(0);

  const nombre = localStorage.getItem('adminName') || 'Usuario';
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    fetch('http://localhost:3000/api/productos/visibles')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al cargar productos:', err));
  }, []);

  useEffect(() => {
    if (ordenIdDesdeRuta) {
      // Cargar datos de orden existente
      fetch(`http://localhost:3000/api/ordenes/${ordenIdDesdeRuta}`)
        .then(res => res.json())
        .then(data => {
          setOrdenId(data.id);
          setNotas(data.notas || '');
          setMontoExtra(data.monto_extra || 0);
          const productosRepetidos = [];
          data.productos.forEach(p => {
            for (let i = 0; i < (p.cantidad || 1); i++) {
              productosRepetidos.push(p);
            }
          });
          setOrden(productosRepetidos);
        })
        .catch(err => console.error('Error al cargar orden existente:', err));
    }
  }, [ordenIdDesdeRuta]);

  const agregarProducto = (producto) => {
    setOrden((prev) => [...prev, producto]);
  };

  const eliminarProducto = (index) => {
    setOrden((prev) => prev.filter((_, i) => i !== index));
  };

  const totalProductos = orden.reduce((sum, item) => sum + parseFloat(item.precio), 0);
  const total = totalProductos + parseFloat(montoExtra || 0);

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro =
      filtro === 'todos' ||
      (filtro === 'alimentos' && p.categoria_id === 1) ||
      (filtro === 'bebidas' && p.categoria_id === 2);
    return coincideBusqueda && coincideFiltro;
  });

  const guardarOrden = async () => {
    setGuardando(true);

    let nuevaOrdenId = ordenId;

    // Solo crear una nueva orden si no hay una existente
    if (!ordenId) {
      const res = await fetch('http://localhost:3000/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesa_id: null }) // puedes incluir mesa si aplica
      });
      const data = await res.json();
      nuevaOrdenId = data.orden_id;
      setOrdenId(nuevaOrdenId);
    }

    const productosAgrupados = Object.values(
      orden.reduce((acc, item) => {
        if (!acc[item.id]) {
          acc[item.id] = { ...item, cantidad: 1 };
        } else {
          acc[item.id].cantidad += 1;
        }
        return acc;
      }, {})
    );

    await fetch(`http://localhost:3000/api/ordenes/${nuevaOrdenId}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productos: productosAgrupados,
        notas,
        monto_extra: parseFloat(montoExtra || 0)
      })
    });

    setGuardando(false);
    alert('Orden guardada correctamente.');
    setOrden([]);
    setNotas('');
    setMontoExtra(0);
  };

  const cancelarOrden = async () => {
    if (!ordenId) return;
    if (window.confirm('¿Cancelar esta orden? Esta acción no se puede deshacer.')) {
      await fetch(`http://localhost:3000/api/ordenes/${ordenId}/cancelar`, {
        method: 'PATCH'
      });
      alert('Orden cancelada.');
      setOrden([]);
    }
  };

  return (
    <>
      {rol === 'admin' ? (
        <AdminHeader nombre={nombre} />
      ) : (
        <HeaderMesero nombre={nombre} />
      )}

      <div className="orden-layout">
        <div className="orden-productos">
          <h2>Menú</h2>
          <div className="barra-controles">
            <input
              type="text"
              className="input-busqueda"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className={`btn-filtro ${filtro === 'todos' ? 'activo' : ''}`} onClick={() => setFiltro('todos')}>Todos</button>
            <button className={`btn-filtro ${filtro === 'alimentos' ? 'activo' : ''}`} onClick={() => setFiltro('alimentos')}>Alimentos</button>
            <button className={`btn-filtro ${filtro === 'bebidas' ? 'activo' : ''}`} onClick={() => setFiltro('bebidas')}>Bebidas</button>
          </div>

          <div className="cards-grid scrollable">
            {productosFiltrados.map((p) => (
              <ProductoCard key={p.id} alimento={p} onClick={agregarProducto} />
            ))}
          </div>
        </div>

        <div className="orden-resumen">
          <h2>Mi Orden</h2>
          {orden.length === 0 ? (
            <p>No hay productos en la orden.</p>
          ) : (
            <ul>
              {orden.map((item, index) => (
                <li key={index}>
                  {item.nombre} - ${Number(item.precio).toFixed(2)}
                  <button className="btn-eliminar" onClick={() => eliminarProducto(index)}>X</button>
                </li>
              ))}
            </ul>
          )}

          <div className="campo-notas">
            <label>Notas:</label>
            <textarea
              rows="3"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Sin cebolla, poco picante..."
            />
          </div>

          <div className="campo-extra">
            <label>Monto extra ($):</label>
            <input
              type="number"
              step="0.01"
              value={montoExtra}
              onChange={(e) => setMontoExtra(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <h3 className="total">Total: ${total.toFixed(2)}</h3>

          {orden.length > 0 && (
            <>
              <button onClick={guardarOrden} disabled={guardando} className="btn-guardar">
                {guardando ? 'Guardando...' : 'Enviar y Guardar Orden'}
              </button>
              <button onClick={cancelarOrden} className="btn-cancelar">Cancelar Orden</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
