// src/pages/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.trim() === '') return;

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) throw new Error('PIN incorrecto');
      const data = await res.json();

      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('adminName', data.name);
      localStorage.setItem('rol', data.role);

      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'mesero') {
        sessionStorage.setItem('pin', pin);
        navigate('/mesero');
      } else {
        alert('Acceso denegado: rol desconocido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. PIN incorrecto o problema en el servidor.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h3 className="login-title">Bienvenido</h3>

        <div className="input-group">
          <label htmlFor="pin" className="input-label">
            Ingresa tu PIN:
          </label>
          <input
            id="pin"
            type="password"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-button">
          Entrar
        </button>
      </form>
    </div>
  );
}
