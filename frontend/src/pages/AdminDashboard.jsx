import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import ProductoPanel from '../components/ProductoPanel';

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('Cargando...');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('adminName');

    if (!token || !name) {
      navigate('/'); // redirige al login si no hay sesión
    } else {
      setAdminName(name);
    }
  }, [navigate]);

  return (
    <div>
      {/* Header sin cambios */}
      <AdminHeader nombre={adminName} />

      {/* Contenido principal */}
      <main className="p-4">
        <ProductoPanel />
      </main>
    </div>
  );
}
