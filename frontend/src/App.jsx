import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import MeseroPage from './pages/MeseroPage';
import OrdenPage from './pages/OrdenPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mesero" element={<MeseroPage />} />
        <Route path="/orden" element={<OrdenPage />} />
        {/* Puedes agregar más rutas aquí según sea necesario */}
      </Routes>
    </BrowserRouter>
  );
}
