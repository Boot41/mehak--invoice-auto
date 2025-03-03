import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { getInvoiceById } from '../data/mockData';

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load invoice data
    const invoiceData = getInvoiceById(parseInt(id));
    if (invoiceData) {
      setInvoice(invoiceData);
    }
    setLoading(false);
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
              Invoice #{invoice.invoiceNumber}
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
                  src={invoice.imageUrl}
                  alt="Invoice preview"
                  className="w-full object-contain"
                />
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Supplier</p>
                    <p className="mt-1 text-sm text-gray-900">{invoice.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                    <p className="mt-1 text-sm text-gray-900">{invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Invoice Date</p>
                    <p className="mt-1 text-sm text-gray-900">{invoice.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p className="mt-1 text-sm text-gray-900">{invoice.dueDate}</p>
                  </div>
                </div>
              </div>

              {invoice.supplierAddress && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Supplier Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900">{invoice.supplier}</p>
                    <p className="text-sm text-gray-900">{invoice.supplierAddress}</p>
                    {invoice.supplierEmail && <p className="text-sm text-gray-900">{invoice.supplierEmail}</p>}
                    {invoice.supplierPhone && <p className="text-sm text-gray-900">{invoice.supplierPhone}</p>}
                  </div>
                </div>
              )}

              {invoice.items && invoice.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Line Items</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qty
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {invoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              ${item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <th scope="row" colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Subtotal
                          </th>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            ${invoice.amount.toFixed(2)}
                          </td>
                        </tr>
                        {invoice.tax && (
                          <tr>
                            <th scope="row" colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                              Tax
                            </th>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              ${invoice.tax.toFixed(2)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <th scope="row" colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Total
                          </th>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                            ${(invoice.total || invoice.amount).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {invoice.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900">{invoice.notes}</p>
                  </div>
                </div>
              )}

              {invoice.approvalHistory && invoice.approvalHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Approval History</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
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
                      <tbody className="bg-white divide-y divide-gray-200">
                        {invoice.approvalHistory.map((history, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {history.date}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {history.user}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${history.action === 'Approved' ? 'bg-green-100 text-green-800' : 
                                  history.action === 'Flagged' ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {history.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {history.notes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;