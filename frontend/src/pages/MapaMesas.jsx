import { useNavigate } from 'react-router-dom';
import Mesa from '../components/Mesa';

export default function MapaMesas() {
  const navigate = useNavigate();

  const mesasNormales = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    estado: i === 11 ? 'ocupada' : 'disponible',
  }));

  const mesasExtras = [
    { id: 'Domicilio', estado: 'disponible' },
    { id: 'Pickup', estado: 'disponible' },
  ];

  const handleClickMesa = (mesaId) => {
    navigate('/orden', { state: { mesaId } });
  };

  return (
    <>
      {/* Matriz 4x3 */}
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
        {mesasNormales.map((mesa) => (
          <Mesa key={mesa.id} numero={mesa.id} estado={mesa.estado} onClick={handleClickMesa} />
        ))}
      </div>

      {/* Mesas especiales */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '2rem',
        }}
      >
        {mesasExtras.map((mesa) => (
          <Mesa key={mesa.id} numero={mesa.id} estado={mesa.estado} onClick={handleClickMesa} />
        ))}
      </div>
    </>
  );
}
