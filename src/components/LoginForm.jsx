/* components/LoginForm.js */
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.post(
        'http://localhost:8080/auth/login',
        data
      );
      console.log('Login response:', response.data);

      const accessToken = response.data?.data?.accessToken;
      const refreshToken = response.data?.data?.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('Token is undefined');
      }

      localStorage.setItem('token', accessToken);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login Error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed';

      if (error.response?.status === 404) {
        setError('identifier', {
          type: 'manual',
          message: 'Username or email not found',
        });
      } else if (error.response?.status === 401) {
        setError('password', { type: 'manual', message: 'Incorrect password' });
      } else {
        setError('identifier', { type: 'manual', message: errorMsg });
        setError('password', { type: 'manual', message: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="mb-3">
        <label className="form-label">Username or Email</label>
        <input
          type="text"
          className={`form-control ${errors.identifier ? 'is-invalid' : ''}`}
          {...register('identifier', {
            required: 'Username or Email is required',
          })}
        />
        {errors.identifier && (
          <div className="invalid-feedback">{errors.identifier.message}</div>
        )}
      </div>
      <div className="mb-3 position-relative">
        <label className="form-label">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register('password', { required: 'Password is required' })}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
