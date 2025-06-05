import { useEffect, useState } from 'react';
import HeaderMesero from '../components/HeaderMesero';
import Mesa from '../components/Mesa';
import { useNavigate } from 'react-router-dom';

export default function MeseroPage() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('Cargando...');

  const mesas = [
    { id: 1, estado: 'disponible' },
    { id: 2, estado: 'disponible' },
    { id: 3, estado: 'disponible' },
    { id: 4, estado: 'disponible' },
    { id: 5, estado: 'disponible' },
    { id: 6, estado: 'disponible' },
    { id: 7, estado: 'disponible' },
    { id: 8, estado: 'disponible' },
    { id: 9, estado: 'disponible' },
    { id: 10, estado: 'disponible' },
    { id: 11, estado: 'disponible' },
    { id: 12, estado: 'ocupada' },
  ];

  const handleClickMesa = (mesaId) => {
    navigate('/orden', { state: { mesaId } });
  };

  useEffect(() => {
  const pin = sessionStorage.getItem('pin');
  if (!pin) {
    navigate('/');
    return;
  }

  fetch(`http://localhost:3000/api/usuario/${pin}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.name) {
        setNombreUsuario(data.name);
      } else {
        setNombreUsuario('Mesero desconocido');
      }
    })
    .catch((err) => {
      console.error('Error al obtener nombre:', err);
      setNombreUsuario('Mesero desconocido');
    });
}, [navigate]);


  return (
    <div style={{ backgroundColor: '#c8a96b', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderMesero nombre={nombreUsuario} />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          paddingTop: '2rem',
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {mesas.map((mesa) => (
          <Mesa key={mesa.id} numero={mesa.id} estado={mesa.estado} onClick={handleClickMesa} />
        ))}
      </div>
    </div>
  );
}
