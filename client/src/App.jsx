import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InvoiceUpload from './pages/InvoiceUpload';
import InvoiceReview from './pages/InvoiceReview';
import InvoiceDetails from './pages/InvoiceDetails';
import ProcessedInvoices from './pages/ProcessedInvoices';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout';
import NotificationProvider from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const GOOGLE_CLIENT_ID = '726611225914-ahgg2o6ub87k9iake8mf8jqgbnu1bg3v.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <NotificationProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="upload" element={<InvoiceUpload />} />
                <Route path="review/:id" element={<InvoiceReview />} />
                <Route path="invoice/:id" element={<InvoiceDetails />} />
                <Route path="processed" element={<ProcessedInvoices />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;