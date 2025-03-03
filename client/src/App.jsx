import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

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

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
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
  );
}

export default App;