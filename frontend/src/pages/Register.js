import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { email, password });
      alert('Registered successfully! Please login.');
      navigate('/');
    } catch (err) {
      alert('Registration failed. The user might already exist.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white">
            Create Your Account ✨
          </h2>
          <p className="mt-2 text-slate-300">Join us and start organizing your notes.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {/* Email Input */}
          <div className="relative">
            <div className="absolute top-3 left-3 text-slate-400">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* Password Input */}
          <div className="relative">
            <div className="absolute top-3 left-3 text-slate-400">
              <FaLock />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-slate-400 font-sans">
          Already have an account?{' '}
          <Link to="/" className="font-medium text-green-400 hover:text-green-300">
            Come on, login!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;