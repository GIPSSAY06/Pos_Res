import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { loginWithPin } from '../services/api';

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = async (pin) => {
        try {
            const user = await loginWithPin(pin);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/mesero');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <LoginForm onLogin={handleLogin} />
        </div>
    );
}
