import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';


const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.details?.[0] || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg w-1/3 min-w-[350px]">
        <h3 className="text-2xl font-bold text-center">Register as Member</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block">Full Name</label>
              <input type="text" name="fullName" placeholder="Full Name"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="mt-4">
              <label className="block">Email</label>
              <input type="email" name="email" placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input type="password" name="password" placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={formData.password} onChange={handleChange} required minLength="6" />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex items-baseline justify-between mt-4">
              <button disabled={loading} className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 w-full disabled:opacity-50">
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
