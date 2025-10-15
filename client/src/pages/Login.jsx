import React, { useState } from 'react';
// Assuming you are using react-router-dom v6+
// The 'useNavigate' hook is the modern way to handle programmatic routing.
import { useNavigate } from 'react-router-dom';
import { LogIn, Key, Mail } from 'lucide-react';

// =====================================================================
// SECURITY WARNING:
// This front-end code is now making a request to a backend that uses
// unhashed passwords (as requested). In a production application, you
// MUST use bcrypt or a similar library to hash passwords.
// =====================================================================

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle login via API
  const handleLogin = async (e) => { // Made function async to use await
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      // 1. Make a real fetch request to the backend /login endpoint
      const response = await fetch('/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send email and password as JSON payload
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) { // Check for successful HTTP status (200-299)
        // Successful login
        console.log("Login Successful! User:", data.user.name);
        // In a real app, you would save the user data or token here (e.g., Context or localStorage)
        
        // Display success message briefly before navigating
        setError("Login successful! Redirecting..."); 
        
        // Use a short delay before navigation for better UX
        setTimeout(() => {
          // --- THIS IS THE CORRECT LINE THAT MOVES TO THE HOME PAGE ---
          navigate('/'); 
        }, 500);

      } else {
        // Failed login (handles errors returned from the server.js file, like "Incorrect password")
        setError(data.message || "Login failed. Please check credentials.");
        setLoading(false); // Only stop loading here on failure, success uses the timeout
      }

    } catch (err) {
      // Handles network errors (e.g., server offline, network connection issue)
      console.error("Network or server error:", err);
      setError("Could not connect to the server. Please check your connection.");
    } finally {
      // If navigation happens, the component unmounts, so we only need to stop loading on failure/error
      if (!response?.ok) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200 transform transition duration-500 hover:scale-[1.02]">
        <div className="flex flex-col items-center mb-6">
          <LogIn className="w-10 h-10 text-indigo-600 mb-3" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign In to Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back!
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className={`border px-4 py-2 rounded-lg text-sm transition duration-150 ${
                error.startsWith("Login successful") 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`} 
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150'
              }`}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Log in'}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')} // --- CORRECT ROUTE USAGE ---
              className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
