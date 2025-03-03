import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, Check, X } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { addInvoice } from '../data/mockData';

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

  const handleSubmit = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Create a new invoice with mock data
      const newInvoice = {
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        supplier: "New Supplier",
        amount: Math.floor(Math.random() * 2000) + 500,
        status: "Pending",
        confidence: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        confidenceIcon: Math.random() > 0.7 ? "🟢" : Math.random() > 0.4 ? "🟡" : "🔴",
        items: [
          { description: "Product/Service", quantity: 1, unitPrice: Math.floor(Math.random() * 2000) + 500, total: Math.floor(Math.random() * 2000) + 500 }
        ],
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      };
      
      // Add the invoice to storage
      const savedInvoice = addInvoice(newInvoice);
      
      // Show notification
      addNotification('Invoice uploaded successfully!', 'success');
      
      // Navigate to review page
      navigate(`/review/${savedInvoice.id}`);
      
      setIsUploading(false);
    }, 2000);
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
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Submit for Processing
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceUpload;