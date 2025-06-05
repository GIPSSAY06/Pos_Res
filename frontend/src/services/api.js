import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export async function loginWithPin(pin) {
    try {
        const response = await axios.post(`${API_URL}/login`, { pin });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error en el login');
    }
}
