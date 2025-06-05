import { useEffect, useState } from 'react';

export default function OrdenPage() {
  const [mesaId, setMesaId] = useState(null);
  const [alimentos, setAlimentos] = useState([]);

  useEffect(() => {
    const mesa = localStorage.getItem('mesaSeleccionada');
    setMesaId(mesa);

    fetch('http://localhost:3000/alimentos')
      .then(res => res.json())
      .then(data => setAlimentos(data))
      .catch(err => console.error('Error al obtener alimentos:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Registrar Orden - Mesa {mesaId}</h2>
      <ul>
        {alimentos.map(alimento => (
          <li key={alimento.id}>{alimento.nombre} - ${alimento.precio}</li>
        ))}
      </ul>
    </div>
  );
}
