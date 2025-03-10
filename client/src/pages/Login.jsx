import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/auth.service'; // Assuming authService is defined in this file

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError(null);
      
      // Decode the credential response
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Send to backend for verification and token generation
      const response = await authService.loginWithGoogle({
        credential: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub
      });

      // Login with the response data
      const success = await login(response);
      
      if (success) {
        // Check if we have a redirect path from a previous attempt
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        throw new Error('Failed to update authentication state');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Failed to authenticate with Google');
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
    setError('Google login failed. Please try again.');
  };

  const features = [
    {
      title: "AI-Powered Invoice Processing",
      description: "Automatically extract data from invoices using advanced AI and OCR technology",
      icon: "🤖"
    },
    {
      title: "Smart Email Integration",
      description: "Auto-fetch invoices from your email attachments with zero manual effort",
      icon: "📧"
    },
    {
      title: "One-Click Approval",
      description: "Review and approve invoices with a streamlined one-click workflow",
      icon: "✅"
    },
    {
      title: "Inventory Management",
      description: "Automatically track and update inventory levels based on approved invoices",
      icon: "📦"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-blue-600">InvoiceAuto</h1>
        <p className="mt-2 text-center text-xl text-gray-600">
          AI-Powered Invoice Processing & Inventory Management
        </p>
      </div>

      {/* Feature Cards */}
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign In Button */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="flex justify-center">
          <GoogleLogin
            clientId="726611225914-ahgg2o6ub87k9iake8mf8jqgbnu1bg3v.apps.googleusercontent.com"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={true}
            size="large"
            type="standard"
            shape="rectangular"
            width="250"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;