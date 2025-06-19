import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import MapaMesas from './MapaMesas'; // Asegúrate de importar el correcto

export default function MapaAdminPage() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Cargando...');

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

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    const nombre = localStorage.getItem('adminName');

    if (rol !== 'admin') {
      navigate('/');
    } else {
      setAdminName(nombre || 'Admin');
    }
  }, [navigate]);

  return (
    <div
      style={{
        backgroundColor: 'rgba(100, 100, 100, 0.1)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AdminHeader nombre={adminName} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <MapaMesas
          mesasNormales={mesasNormales}
          mesasExtras={mesasExtras}
          onClickMesa={handleClickMesa}
        />
      </div>
    </div>
  );
}
