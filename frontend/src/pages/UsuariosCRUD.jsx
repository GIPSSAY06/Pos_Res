import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import './UsuariosCRUD.css';

export default function UsuariosCRUD() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState('usuario');

  const [adminName, setAdminName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('adminName');

    if (!token || !storedName) {
      navigate('/');
      return;
    }

    setAdminName(storedName);
    fetchUsuarios();
  }, [navigate]);

  const fetchUsuarios = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/usuarios');
      if (!res.ok) throw new Error('Error cargando usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setName('');
    setPin('');
    setRole('usuario');
    setUsuarioEditando(null);
    setModoEdicion(false);
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin, role }),
      });
      if (!res.ok) throw new Error('Error al crear usuario');
      await fetchUsuarios();
      limpiarFormulario();
    } catch (err) {
      alert(err.message);
    }
  };

  const editarUsuario = (usuario) => {
    setModoEdicion(true);
    setUsuarioEditando(usuario);
    setName(usuario.name);
    setPin(usuario.pin || '');
    setRole(usuario.role);
  };

  const actualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${usuarioEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin, role }),
      });
      if (!res.ok) throw new Error('Error al actualizar usuario');
      await fetchUsuarios();
      limpiarFormulario();
    } catch (err) {
      alert(err.message);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar usuario');
      await fetchUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <AdminHeader nombre={adminName} />
      <main className="usuarios-container">
        <h1 className="page-title">Gestión de Usuarios</h1>

        <form
          onSubmit={modoEdicion ? actualizarUsuario : crearUsuario}
          className="usuario-form"
        >
          <h2>{modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>

          <label>
            Nombre:
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>

          <label>
            PIN:
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              required
              maxLength={6}
            />
          </label>

          <label>
            Rol:
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
              <option value="mesero">Mesero</option>
            </select>
          </label>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {modoEdicion ? 'Actualizar' : 'Crear'}
            </button>
            {modoEdicion && (
              <button type="button" className="btn-secondary" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <section className="usuarios-listado">
          <h2>Usuarios Registrados</h2>

          {cargando && <p>Cargando usuarios...</p>}
          {error && <p className="error">{error}</p>}

          {!cargando && !error && usuarios.length === 0 && <p>No hay usuarios.</p>}

          {!cargando && !error && usuarios.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.name}</td>
                    <td>{usuario.role}</td>
                    <td>
                      <button className="btn-secondary" onClick={() => editarUsuario(usuario)}>
                        Editar
                      </button>
                      <button className="btn-danger" onClick={() => eliminarUsuario(usuario.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}
