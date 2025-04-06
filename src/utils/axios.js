import axios from 'axios';
import Swal from 'sweetalert2';

// Membuat instance Axios dengan baseURL yang ditentukan
const api = axios.create({
  baseURL: 'https://pintek-rest-production.up.railway.app',
});

// Interceptor untuk menyisipkan token ke setiap permintaan
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk menangani respons
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika menerima status 401 dan belum dicoba ulang
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.put(
          'https://pintek-rest-production.up.railway.app/auth/token',
          {
            refreshToken,
          }
        );

        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 🔥 Pastikan ini hanya dijalankan kalau refresh GAGAL
        console.error('Token refresh failed:', refreshError);

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        Swal.fire({
          title: 'Sesi Anda telah berakhir',
          text: 'Silakan login kembali.',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);

        return Promise.reject(refreshError);
      }
    }
  }
);

export default api;
