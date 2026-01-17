const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const createBooking = async (bookingData) => {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers,
            body: JSON.stringify(bookingData),
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: 'Network error' };
    }
};
