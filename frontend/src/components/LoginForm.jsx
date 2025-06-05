import { useState } from 'react';

export default function LoginForm({ onLogin }) {
    const [pin, setPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin.trim() === '') return;
        onLogin(pin);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />
            <button type="submit">Entrar</button>
        </form>
    );
}
