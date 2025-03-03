import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, AlertTriangle, Edit2 } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { getInvoiceById, updateInvoice } from '../data/mockData';

function InvoiceReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Load invoice data
    const invoiceData = getInvoiceById(parseInt(id));
    if (invoiceData) {
      setInvoice(invoiceData);
      setFormData({
        supplier: invoiceData.supplier,
        invoiceNumber: invoiceData.invoiceNumber,
        date: invoiceData.date,
        dueDate: invoiceData.dueDate,
        amount: invoiceData.amount,
      });
    }
    setLoading(false);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    });
  };

  const handleApprove = () => {
    if (!invoice) return;
    
    // Update invoice with form data and change status
    const updatedInvoice = {
      ...invoice,
      ...formData,
      status: 'Approved',
      approvalHistory: [
        ...(invoice.approvalHistory || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'John Doe',
          action: 'Approved',
          notes: 'Approved after review',
        },
      ],
    };
    
    updateInvoice(updatedInvoice);
    addNotification('Invoice approved successfully!', 'success');
    navigate('/');
  };

  const handleFlag = () => {
    if (!invoice) return;
    
    // Update invoice with form data and change status
    const updatedInvoice = {
      ...invoice,
      ...formData,
      status: 'Flagged',
      approvalHistory: [
        ...(invoice.approvalHistory || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'John Doe',
          action: 'Flagged',
          notes: 'Flagged for review',
        },
      ],
    };
    
    updateInvoice(updatedInvoice);
    addNotification('Invoice flagged for further review', 'info');
    navigate('/');
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Review Invoice</h1>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Confidence:</span>
              <span className="text-2xl" title={invoice.confidence}>
                {invoice.confidenceIcon}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Preview */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Preview</h2>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={invoice.imageUrl}
                  alt="Invoice preview"
                  className="w-full object-contain"
                />
              </div>
            </div>

            {/* Extracted Data */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Extracted Data</h2>
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  {editMode ? 'Cancel Edit' : 'Edit Fields'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{invoice.supplier}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{invoice.invoiceNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                  {editMode ? (
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{invoice.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  {editMode ? (
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{invoice.dueDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  {editMode ? (
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">${invoice.amount.toFixed(2)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleFlag}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Flag for Review
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceReview;