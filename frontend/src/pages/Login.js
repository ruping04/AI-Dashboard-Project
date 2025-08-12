import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('user_email', email);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 animate-gradient"></div>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background: linear-gradient(270deg, #800080, #0000FF); /* Purple to Blue */
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }
        `}
      </style>

      {/* Login Form Container */}
      <div className="relative flex justify-center items-center h-full w-full p-8">
        <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl text-white">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-white">
              Welcome Back! ✨
            </h2>
            <p className="mt-2 text-slate-300">Login to access your smart notes.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
              Login
            </button>
          </form>

          <div className="text-center text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;