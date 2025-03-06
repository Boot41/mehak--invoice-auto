import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, Check, X } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

function InvoiceUpload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Function to check if invoice qualifies for auto-approval
  const checkAutoApproval = (invoiceData) => {
    const amount = parseFloat(invoiceData.amount);
    const units = parseInt(invoiceData.number_of_units);
    return amount < 200 && units < 5;
  };

  // Function to auto-approve invoice
  const autoApproveInvoice = async (invoiceData) => {
    try {
      const response = await fetch('/api/approve-invoice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to auto-approve invoice');
      }

      const result = await response.json();
      addNotification('Invoice auto-approved successfully!', 'success');
      return result;
    } catch (error) {
      console.error('Auto-approval error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // First upload the file to get the URL
      const formData = new FormData();
      formData.append('document', file);

      const uploadResponse = await fetch('/api/upload-invoice/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { url } = await uploadResponse.json();

      // Now process the invoice using the URL
      const processResponse = await fetch('/api/process-invoice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ pdf_url: url }),
      });

      if (!processResponse.ok) {
        throw new Error('Failed to process invoice');
      }

      const processedData = await processResponse.json();
      
      // Check if invoice qualifies for auto-approval
      if (checkAutoApproval(processedData)) {
        try {
          // Attempt to auto-approve the invoice
          const approvalResult = await autoApproveInvoice(processedData);
          
          // Store the approved invoice data
          localStorage.setItem(`invoice_${approvalResult.id}`, JSON.stringify({
            ...processedData,
            status: 'Approved',
            id: approvalResult.id
          }));
          
          // Navigate to invoice details page using the ID from the response
          navigate(`/invoice/${approvalResult.id}`);
          return;
        } catch (error) {
          // If auto-approval fails, continue with manual review
          console.warn('Auto-approval failed, continuing with manual review:', error);
          addNotification('Auto-approval failed, please review the invoice manually', 'warning');
        }
      }
      
      // If not auto-approved or auto-approval failed, continue with manual review
      const invoiceId = processedData.invoice_id;
      localStorage.setItem(`invoice_${invoiceId}`, JSON.stringify(processedData));
      addNotification('Invoice uploaded and ready for review', 'success');
      navigate(`/review/${invoiceId}`);
    } catch (error) {
      console.error('Error:', error);
      addNotification(error.message || 'Failed to process invoice', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Upload Invoice</h1>
          <p className="mt-1 text-gray-500">
            Upload an invoice file to process and extract data automatically
          </p>
        </div>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            
            {!file ? (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">
                  Drag and drop your invoice here, or{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500"
                    onClick={handleUploadClick}
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supports PDF, JPG, JPEG, PNG (up to 10MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <File className="h-8 w-8 text-blue-500" />
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ml-4 text-gray-400 hover:text-gray-500"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">File Preview</h2>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Invoice preview"
                      className="max-h-96 object-contain"
                    />
                  ) : (
                    <div className="text-center p-12">
                      <File className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Preview not available for this file type
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                file && !isUploading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              onClick={handleSubmit}
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Upload and Process'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceUpload;