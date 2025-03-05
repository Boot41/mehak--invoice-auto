import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

function InvoiceReview() {
  const [invoice, setInvoice] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load invoice data from localStorage
    const data = localStorage.getItem(`invoice_${id}`);
    if (data) {
      setInvoice(JSON.parse(data));
    } else {
      addNotification('Invoice data not found', 'error');
      navigate('/');
    }
  }, [id, navigate, addNotification]);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch('/api/approve-invoice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          invoice_id: id,
          ...invoice
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve invoice');
      }

      // Clear the invoice data from localStorage
      localStorage.removeItem(`invoice_${id}`);
      
      addNotification('Invoice approved successfully!', 'success');
      navigate('/processed');
    } catch (error) {
      console.error('Error:', error);
      addNotification(error.message || 'Failed to approve invoice', 'error');
    } finally {
      setIsApproving(false);
    }
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Review Invoice</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Invoice Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.invoice_number}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.date}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.due_date || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">${invoice.amount}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Supplier Information</h3>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.supplier}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.supplier_email || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.supplier_phone || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.supplier_address || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {invoice.line_items && invoice.line_items.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.line_items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${item.unit_price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Subtotal</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${invoice.amount}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Tax</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${invoice.tax}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">${invoice.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? 'Approving...' : 'Approve Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceReview;