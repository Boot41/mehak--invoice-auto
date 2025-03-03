import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getInvoices, initializeMockData } from '../data/mockData';

function Dashboard() {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    flagged: 0
  });

  useEffect(() => {
    // Initialize mock data if needed
    initializeMockData();
    
    // Load invoices from localStorage
    const loadedInvoices = getInvoices();
    setInvoices(loadedInvoices);
    
    // Calculate stats
    const pending = loadedInvoices.filter(inv => inv.status === 'Pending').length;
    const approved = loadedInvoices.filter(inv => inv.status === 'Approved').length;
    const flagged = loadedInvoices.filter(inv => inv.status === 'Flagged').length;
    
    setStats({ pending, approved, flagged });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser?.name}
        </h1>
        <p className="mt-1 text-gray-500">
          Here's an overview of your invoice processing activity
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Pending</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/processed?status=Pending"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all pending invoices
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Approved</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/processed?status=Approved"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              View all approved invoices
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Flagged</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.flagged}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/processed?status=Flagged"
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              View all flagged invoices
            </Link>
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Invoice
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.slice(0, 5).map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {invoice.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${invoice.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        invoice.status === 'Flagged' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}> 
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                   {invoice.numberOfUnits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {invoice.status === 'Pending' ? (
                      <Link
                        to={`/review/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Review
                      </Link>
                    ) : (
                      <Link
                        to={`/invoice/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <Link
            to="/processed"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all invoices
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;