import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        // Sign up logic
        const result = await register(name, email, password);
        if (result.success) {
          setSuccess('Registration successful! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setError(result.error);
        }
      } else {
        // Sign in logic
        const result = await login(email, password);
        if (result.success) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div className={`min-h-screen mt-0 py-0 transition-colors duration-500 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
     
      {/* Main content */}
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 sm:py-16">
        <div className="max-w-md w-full space-y-8">
          {/* Login/Signup Form */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8 transition-colors duration-500`}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                TempleTravellerZ
              </h1>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Mandir Tails, Modern Trails
              </p>
              <h2 className={`mt-2 text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                {isSignUp ? 'Join our community of travellerz' : 'Welcome back'}
              </h2>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field for signup */}
              {isSignUp && (
                <div>
                  <label className={`block text-sm px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    disabled={loading}
                    className={`mt-1 block w-full px-4 py-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              {/* Email field */}
              <div>
                <label className={`block  text-sm px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className={`mt-1 block w-full px-4 py-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              
              {/* Password field */}
              <div>
                <label className={`block text-sm px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className={`mt-1 block w-full px-4 py-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your password"
                  minLength="6"
                />
              </div>
              
              {/* Submit button */}
              <div>
                <div className='flex justify-center'>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-1/2 flex justify-center py-3 px-6 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105 ${
                    loading ? 'opacity-50 cursor-not-allowed transform-none' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </div>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </button>
                </div>
              </div>
            </form>

            {/* Toggle between login and signup */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={toggleMode}
                  disabled={loading}
                  className={`font-medium text-orange-600 hover:text-orange-500 transition-colors duration-300 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSignUp ? 'Sign in here' : 'Sign up here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;