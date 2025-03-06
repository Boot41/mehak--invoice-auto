import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import axios from 'axios';

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState({
    id: '',
    invoice_number: '',
    date: '',
    due_date: '',
    supplier: '',
    amount: 0,
    status: '',
    confidence: '',
    confidence_score: 0,
    number_of_units: 0,
    supplier_address: '123 Business Street, City, Country',
    supplier_email: '',
    supplier_phone: '+1 (555) 123-4567',
    tax: 0,
    total: 0,
    notes: '',
    image_url: '',
    created_at: '',
    updated_at: '',
    user: null,
    line_items: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/invoices/${id}/`);
        const processedData = {
          ...response.data,
          amount: parseFloat(response.data.amount) || 0,
          tax: parseFloat(response.data.tax) || 0,
          total: parseFloat(response.data.total) || 0,
          confidence_score: parseInt(response.data.confidence_score) || 0,
          number_of_units: parseInt(response.data.number_of_units) || 0,
          supplier_address: response.data.supplier_address || '123 Business Street, City, Country',
          supplier_phone: response.data.supplier_phone || '+1 (555) 123-4567',
          line_items: response.data.line_items || []
        };
        
        setInvoice(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      }
    };

    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or other file format
    alert('In a real application, this would download the invoice as a PDF.');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoice Not Found</h1>
        <p className="mt-2 text-gray-500">The invoice you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice #{invoice.invoice_number}
            </h1>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
              ${invoice.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                invoice.status === 'Flagged' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Preview */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Preview</h2>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={invoice.image_url}
                  alt="Invoice preview"
                  className="w-full object-contain"
                />
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoice Details</h2>
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px space-x-8">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap border-b-2 ${
                        activeTab === 'details'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setActiveTab('lineItems')}
                      className={`py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap border-b-2 ${
                        activeTab === 'lineItems'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Line Items
                    </button>
                    <button
                      onClick={() => setActiveTab('approvalHistory')}
                      className={`py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap border-b-2 ${
                        activeTab === 'approvalHistory'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Approval History
                    </button>
                  </nav>
                </div>
                <div className="mt-6">
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-sm font-medium text-gray-500">Supplier</p>
                          <p className="mt-1 text-sm text-gray-900">{invoice.supplier}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                          <p className="mt-1 text-sm text-gray-900">{invoice.invoice_number}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-sm font-medium text-gray-500">Invoice Date</p>
                          <p className="mt-1 text-sm text-gray-900">{invoice.date}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-sm font-medium text-gray-500">Due Date</p>
                          <p className="mt-1 text-sm text-gray-900">{invoice.due_date}</p>
                        </div>
                      </div>

                      {invoice.supplier_address && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Supplier Information</h3>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{invoice.supplier}</p>
                            <p className="text-sm text-gray-600">{invoice.supplier_address}</p>
                            {invoice.supplier_email && <p className="text-sm text-gray-600">{invoice.supplier_email}</p>}
                            {invoice.supplier_phone && <p className="text-sm text-gray-600">{invoice.supplier_phone}</p>}
                          </div>
                        </div>
                      )}

                      {invoice.notes && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Notes</h3>
                          <p className="text-sm text-gray-600">{invoice.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'lineItems' && (
                    <div className="space-y-4">
                      {invoice.line_items && invoice.line_items.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {invoice.line_items.map((item, index) => (
                                <tr key={item.id || index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(item.unit_price).toFixed(2)}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(item.total).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                              <tr>
                                <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(invoice.total).toFixed(2)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No line items provided for this invoice.
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'approvalHistory' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        {invoice.approvalHistory && invoice.approvalHistory.length > 0 ? (
                          <tbody className="bg-white divide-y divide-gray-200">
                            {invoice.approvalHistory.map((history, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {history.user}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {history.action}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {history.notes}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
                                Soon to be added feature!!
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;