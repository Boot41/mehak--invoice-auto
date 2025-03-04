import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const TOKEN_STORAGE_KEY = 'auth_tokens';
const USER_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup axios interceptors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry && tokens?.refresh_token) {
          originalRequest._retry = true;
          
          try {
            const newTokens = await refreshTokens(tokens.refresh_token);
            updateTokens(newTokens);
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [tokens]);

  // Initialize auth state from storage
  useEffect(() => {
    const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (storedTokens && storedUser) {
      const parsedTokens = JSON.parse(storedTokens);
      if (!isTokenExpired(parsedTokens.access_token)) {
        setTokens(parsedTokens);
        setCurrentUser(JSON.parse(storedUser));
        setupAxiosDefaults(parsedTokens.access_token);
      } else if (parsedTokens.refresh_token) {
        refreshTokens(parsedTokens.refresh_token)
          .then(newTokens => {
            updateTokens(newTokens);
          })
          .catch(() => {
            clearAuthState();
          });
      } else {
        clearAuthState();
      }
    }
    setLoading(false);
  }, []);

  const setupAxiosDefaults = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const refreshTokens = async (refreshToken) => {
    const response = await axios.post('/api/auth/refresh/', { refresh_token: refreshToken });
    return response.data;
  };

  const updateTokens = (newTokens) => {
    setTokens(newTokens);
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newTokens));
    setupAxiosDefaults(newTokens.access_token);
  };

  const clearAuthState = () => {
    setTokens(null);
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setupAxiosDefaults(null);
  };

  const login = async (authData) => {
    try {
      setError(null);
      const { access_token, refresh_token, user } = authData;
      
      const tokens = { access_token, refresh_token };
      updateTokens(tokens);
      localStorage.setItem('token', access_token); // Update AuthContext to store token in localStorage after login
      setCurrentUser(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      
      return true;
    } catch (error) {
      setError(error.message);
      clearAuthState();
      return false;
    }
  };

  const logout = () => {
    clearAuthState();
  };

  const value = {
    currentUser,
    tokens,
    loading,
    error,
    isAuthenticated: !!tokens?.access_token && !isTokenExpired(tokens.access_token),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}