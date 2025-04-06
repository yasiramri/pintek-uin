import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import axios from 'axios';

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now().valueOf() / 1000;
    return decoded.exp < now;
  } catch (err) {
    return true;
  }
}

export default function PrivateRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      const tokenInvalid = !token || isTokenExpired(token);
      const refreshInvalid = !refreshToken;

      console.log('[PrivateRoute] Checking token...');
      console.log('Access Token:', token);
      console.log('Refresh Token:', refreshToken);
      console.log('Token invalid:', tokenInvalid);
      console.log('Refresh token invalid:', refreshInvalid);

      if (!tokenInvalid) {
        setIsValid(true);
        setChecking(false);
        return;
      }

      if (tokenInvalid && !refreshInvalid) {
        try {
          const res = await axios.put(
            'https://pintek-rest-production.up.railway.app/auth/token',
            {
              refreshToken,
            }
          );
          console.log('[PrivateRoute] Refresh response full:', res.data);
          const newAccessToken = res.data.data.accessToken;
          const newRefreshToken = res.data.data.refreshToken;

          if (newAccessToken) {
            localStorage.setItem('token', newAccessToken);

            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            setIsValid(true);
          } else {
            console.warn('Refresh response tidak mengandung accessToken');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setIsValid(false);
          }
        } catch (err) {
          console.error(
            'Gagal refresh token:',
            err.response?.data || err.message
          );
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setIsValid(false);
        } finally {
          setChecking(false);
        }
        return;
      }

      // Kalau dua-duanya invalid
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setIsValid(false);
      setChecking(false);
    };

    validateToken();
  }, []);

  if (checking) return null; // Atau loading spinner

  return isValid ? children : <Navigate to="/login" replace />;
}
