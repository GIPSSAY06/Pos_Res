import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MeseroPage from './pages/MeseroPage';
import OrdenPage from './pages/OrdenPage';
import OrdenesAbiertas from './pages/OrdenesAbiertas';
import UsuariosCRUD from './pages/UsuariosCRUD';
import CorteDelDia from './pages/CorteDelDia';
import MapaMesas from './pages/MapaMesas';
import MapaAdminPage from './pages/MapaAdminPage';
import ProductoPanel from './components/ProductoPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/mesero" element={<MeseroPage />} />
        <Route path="/orden" element={<OrdenPage />} />
        <Route path="/ordenes-abiertas" element={<OrdenesAbiertas />} />
        <Route path="/usuarios" element={<UsuariosCRUD />} />
        <Route path="/corte-dia" element={<CorteDelDia />} />
        <Route path="/mesas" element={<MapaMesas />} />
        <Route path="/admin/mapa" element={<MapaAdminPage />} />
        <Route path="/producto-panel" element={<ProductoPanel/>} />
      </Routes>
    </BrowserRouter>
  );
}
