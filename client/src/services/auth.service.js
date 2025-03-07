import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

class AuthService {
    async loginWithGoogle(googleData) {
        try {
            const response = await axios.post(`${API_URL}/auth/google/`, {
                token: googleData.credential,
                email: googleData.email,
                name: googleData.name,
                picture: googleData.picture,
                google_id: googleData.sub
            });

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            const message = error.response.data.message || error.response.data.error || 'Authentication failed';
            return new Error(message);
        }
        return new Error('Network error occurred');
    }
}

// Create a single instance and export it as default
const authService = new AuthService();
export default authService;
