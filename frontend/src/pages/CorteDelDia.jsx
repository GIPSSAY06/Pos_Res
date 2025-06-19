import React, { useState, useEffect, useRef } from 'react';
import AdminHeader from '../components/AdminHeader'; // Asegúrate que esta ruta sea correcta
import './CorteDelDia.css';

export default function CorteDelDia() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState('');

  const printRef = useRef();

  useEffect(() => {
    const nombre = localStorage.getItem('adminName');
    if (nombre) setAdminName(nombre);
  }, []);

  const fetchOrdenes = async (inicio, fin) => {
    setCargando(true);
    setError(null);
    try {
      const dataSimulada = [
        {
          id: 101,
          fecha: '2025-06-17',
          cliente: 'Juan Pérez',
          items: [
            { nombre: 'Hamburguesa', cantidad: 2, precioUnit: 120 },
            { nombre: 'Refresco', cantidad: 2, precioUnit: 30 },
          ],
          total: 300,
          impuesto: 48,
        },
        {
          id: 102,
          fecha: '2025-06-17',
          cliente: 'María López',
          items: [
            { nombre: 'Papas Fritas', cantidad: 1, precioUnit: 50 },
            { nombre: 'Refresco', cantidad: 1, precioUnit: 30 },
          ],
          total: 80,
          impuesto: 12.8,
        },
      ];

      let filtradas = dataSimulada;
      if (inicio && fin) {
        filtradas = dataSimulada.filter(o => o.fecha >= inicio && o.fecha <= fin);
      }

      await new Promise(r => setTimeout(r, 500));
      setOrdenes(filtradas);
    } catch {
      setError('Error cargando órdenes');
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = () => {
    if (!fechaInicio || !fechaFin) {
      alert('Selecciona ambas fechas para buscar.');
      return;
    }
    fetchOrdenes(fechaInicio, fechaFin);
  };

  const calcularTotales = () => {
    const totalVentas = ordenes.reduce((acc, o) => acc + o.total, 0);
    const totalImpuestos = ordenes.reduce((acc, o) => acc + o.impuesto, 0);
    return { totalVentas, totalImpuestos };
  };

  const handleImprimir = () => {
    if (!ordenes.length) {
      alert('No hay datos para imprimir.');
      return;
    }

    const printContent = printRef.current.innerHTML;
    const ventanaImpresion = window.open('', '', 'width=800,height=600');
    ventanaImpresion.document.write('<html><head><title>Corte de Ventas</title>');
    ventanaImpresion.document.write('<style>');
    ventanaImpresion.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1, h2 { text-align: center; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #444; padding: 8px; text-align: left; }
      th { background: #eee; }
    `);
    ventanaImpresion.document.write('</style></head><body>');
    ventanaImpresion.document.write(printContent);
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
    ventanaImpresion.close();
  };

  const { totalVentas, totalImpuestos } = calcularTotales();

  return (
    <>
      <AdminHeader nombre={adminName} />

      <div className="corte-container">
        <h1 className="corte-title">Corte de Ventas</h1>

        <section className="filtro-fechas">
          <label>
            Fecha Inicio:
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
            />
          </label>

          <label>
            Fecha Fin:
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
            />
          </label>

          <button onClick={handleBuscar} className="btn-buscar">Buscar</button>
        </section>

        {cargando && <p>Cargando órdenes...</p>}
        {error && <p className="error">{error}</p>}
        {!cargando && !error && ordenes.length === 0 && (
          <p>No se encontraron órdenes para el rango seleccionado.</p>
        )}

        {!cargando && ordenes.length > 0 && (
          <>
            <section ref={printRef} className="resumen-ventas">
              <h2>Resumen de Ventas</h2>
              <p><strong>Del:</strong> {fechaInicio} <strong>Al:</strong> {fechaFin}</p>

              <table className="tabla-ordenes">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Impuesto</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map(({ id, fecha, cliente, items, total, impuesto }) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{fecha}</td>
                      <td>{cliente}</td>
                      <td>
                        <ul className="lista-items">
                          {items.map((item, i) => (
                            <li key={i}>
                              {item.cantidad} x {item.nombre} @ ${item.precioUnit}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>${total.toFixed(2)}</td>
                      <td>${impuesto.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="totales">
                Total Ventas: ${totalVentas.toFixed(2)} | Total Impuestos: ${totalImpuestos.toFixed(2)}
              </h3>
            </section>

            <button onClick={handleImprimir} className="btn-imprimir">Imprimir Corte</button>
          </>
        )}
      </div>
    </>
  );
}
