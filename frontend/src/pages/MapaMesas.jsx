import { useNavigate } from 'react-router-dom';
import Mesa from '../components/Mesa';
import { useEffect, useState } from 'react';

export default function MapaMesas() {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/mesas') // Cambia si tu ruta es diferente
      .then(res => res.json())
      .then(data => setMesas(data))
      .catch(err => {
        console.error('Error al cargar mesas:', err);
      });
  }, []);

  const handleClickMesa = (mesaId, estado) => {
    // Evitar seleccionar mesa ocupada (excepto Pickup y Domicilio)
    const isEspecial = mesaId === 'Pickup' || mesaId === 'Domicilio';
    if (estado === 'ocupada' && !isEspecial) {
      alert('Esta mesa está ocupada.');
      return;
    }

    navigate('/orden', { state: { mesaId } });
  };

  const mesasNormales = mesas.filter(mesa => /^\d+$/.test(mesa.id));
  const mesasEspeciales = mesas.filter(mesa => !/^\d+$/.test(mesa.id));

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2.5rem',
          maxWidth: '900px',
          width: '100%',
          justifyItems: 'center',
          padding: '2rem',
        }}
      >
        {mesasNormales.length === 0 && <p>Cargando mesas normales...</p>}
        {mesasNormales.map((mesa) => (
          <Mesa
            key={mesa.id}
            numero={mesa.id}
            estado={mesa.estado}
            onClick={() => handleClickMesa(mesa.id, mesa.estado)}
          />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '2rem',
        }}
      >
        {mesasEspeciales.length === 0 && <p>Cargando mesas especiales...</p>}
        {mesasEspeciales.map((mesa) => (
          <Mesa
            key={mesa.id}
            numero={mesa.id}
            estado={mesa.estado}
            onClick={() => handleClickMesa(mesa.id, mesa.estado)}
          />
        ))}
      </div>
    </>
  );
}
