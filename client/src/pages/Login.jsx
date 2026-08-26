import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../services/authService';

import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await loginApi({ email, password });
      const { token, profile } = res.data.data;
      login(token, profile);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.details?.[0] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg w-1/3 min-w-[350px]">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block">Email</label>
              <input type="email" placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input type="password" placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex items-baseline justify-between mt-4">
              <button disabled={loading} className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 w-full disabled:opacity-50">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link to="/register" className="text-sm text-blue-600 hover:underline">Don't have an account? Register</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
