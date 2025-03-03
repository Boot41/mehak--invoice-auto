import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink, Eye } from 'lucide-react';
import { getInvoices } from '../data/mockData';

function ProcessedInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    // Load invoices from localStorage
    const loadedInvoices = getInvoices();
    setInvoices(loadedInvoices);
    setFilteredInvoices(loadedInvoices);
    
    // Extract unique suppliers for filter dropdown
    const uniqueSuppliers = [...new Set(loadedInvoices.map(inv => inv.supplier))];
    setSuppliers(uniqueSuppliers);
    
    // Check if there's a status filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam);
      filterInvoices(loadedInvoices, searchTerm, statusParam, dateFilter, supplierFilter);
    }
  }, []);

  const filterInvoices = (invoices, search, status, date, supplier) => {
    let filtered = [...invoices];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(searchLower) ||
        inv.supplier.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (status) {
      filtered = filtered.filter(inv => inv.status === status);
    }
    
    // Apply date filter
    if (date) {
      filtered = filtered.filter(inv => inv.date === date);
    }
    
    // Apply supplier filter
    if (supplier) {
      filtered = filtered.filter(inv => inv.supplier === supplier);
    }
    
    setFilteredInvoices(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterInvoices(invoices, value, statusFilter, dateFilter, supplierFilter);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterInvoices(invoices, searchTerm, value, dateFilter, supplierFilter);
  };

  const handleDateFilter = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    filterInvoices(invoices, searchTerm, statusFilter, value, supplierFilter);
  };

  const handleSupplierFilter = (e) => {
    const value = e.target.value;
    setSupplierFilter(value);
    filterInvoices(invoices, searchTerm, statusFilter, dateFilter, value);
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Invoice Number', 'Date', 'Supplier', 'Amount', 'Status', 'Number of Units'];
    const csvContent = [
      headers.join(','),
      ...filteredInvoices.map(inv => [
        inv.invoiceNumber,
        inv.date,
        inv.supplier,
        inv.amount.toFixed(2),
        inv.status,
        inv.numberOfUnits
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
    setSupplierFilter('');
    setFilteredInvoices(invoices);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Processed Invoices</h1>
          <p className="mt-1 text-gray-500">
            View, search, and export all processed invoices
          </p>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search invoices..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Filter:</span>
            </div>
            <div className="flex items-center space-x-4">
            {(searchTerm || statusFilter || dateFilter || supplierFilter) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Export CSV
            </button>
            
          </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="w-full">
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>
            <div className="w-full">
              <select
                value={supplierFilter}
                onChange={handleSupplierFilter}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier, index) => (
                  <option key={index} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <input
                type="date"
                value={dateFilter}
                onChange={handleDateFilter}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
          
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
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => {
                  console.log(invoice); // Log the invoice data
                  return (
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
                        <Link
                          to={`/invoice/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4 inline mr-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No invoices found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessedInvoices;