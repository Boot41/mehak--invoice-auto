// Mock user data
export const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

// Mock invoices data
export const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-2023-001",
    date: "2023-10-01",
    dueDate: "2023-10-15",
    supplier: "Supplier A",
    amount: 1250.00,
    status: "Pending",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 95,
    numberOfUnits: 10
  },
  {
    id: 2,
    invoiceNumber: "INV-2023-002",
    date: "2023-10-02",
    dueDate: "2023-10-16",
    supplier: "Supplier B",
    amount: 750.50,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 90,
    numberOfUnits: 5
  },
  {
    id: 3,
    invoiceNumber: "INV-2023-003",
    date: "2023-10-03",
    dueDate: "2023-10-17",
    supplier: "Supplier C",
    amount: 2500.00,
    status: "Flagged",
    confidence: "low",
    confidenceIcon: "",
    confidenceScore: 80,
    numberOfUnits: 15
  },
  {
    id: 4,
    invoiceNumber: "INV-2023-004",
    date: "2023-10-04",
    dueDate: "2023-10-18",
    supplier: "Supplier D",
    amount: 1800.75,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 85,
    numberOfUnits: 8
  },
  {
    id: 5,
    invoiceNumber: "INV-2023-005",
    date: "2023-10-05",
    dueDate: "2023-10-19",
    supplier: "Supplier E",
    amount: 950.25,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 92,
    numberOfUnits: 12
  },
  {
    id: 6,
    invoiceNumber: "INV-2023-006",
    date: "2023-10-06",
    dueDate: "2023-10-20",
    supplier: "Supplier F",
    amount: 3200.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 88,
    numberOfUnits: 20
  },
  {
    id: 7,
    invoiceNumber: "INV-2023-007",
    date: "2023-10-07",
    dueDate: "2023-10-21",
    supplier: "Supplier G",
    amount: 1500.50,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 96,
    numberOfUnits: 18
  },
  {
    id: 8,
    invoiceNumber: "INV-2023-008",
    date: "2023-10-08",
    dueDate: "2023-10-22",
    supplier: "Supplier H",
    amount: 2100.25,
    status: "Flagged",
    confidence: "low",
    confidenceIcon: "",
    confidenceScore: 78,
    numberOfUnits: 22
  }
];

// Mock invoice details with more comprehensive data
export const mockInvoiceDetails = {
  1: {
    id: 1,
    invoiceNumber: "INV-2023-001",
    date: "2023-10-01",
    dueDate: "2023-10-15",
    supplier: "Supplier A",
    supplierAddress: "123 Business St, City, State 12345",
    supplierEmail: "accounts@suppliera.com",
    supplierPhone: "(555) 123-4567",
    amount: 1250.00,
    tax: 100.00,
    total: 1350.00,
    status: "Pending",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 95,
    numberOfUnits: 10,
    items: [
      { description: "Product A", quantity: 5, unitPrice: 150.00, total: 750.00 },
      { description: "Service B", quantity: 2, unitPrice: 250.00, total: 500.00 }
    ],
    notes: "Net 15 payment terms",
    approvalHistory: [],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  2: {
    id: 2,
    invoiceNumber: "INV-2023-002",
    date: "2023-10-02",
    dueDate: "2023-10-16",
    supplier: "Supplier B",
    supplierAddress: "456 Vendor Ave, City, State 12345",
    supplierEmail: "billing@supplierb.com",
    supplierPhone: "(555) 234-5678",
    amount: 750.50,
    tax: 60.04,
    total: 810.54,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 90,
    numberOfUnits: 5,
    items: [
      { description: "Monthly Service", quantity: 1, unitPrice: 750.50, total: 750.50 }
    ],
    notes: "Recurring monthly invoice",
    approvalHistory: [
      { date: "2023-10-03", user: "John Doe", action: "Approved", notes: "Regular monthly service" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  3: {
    id: 3,
    invoiceNumber: "INV-2023-003",
    date: "2023-10-03",
    dueDate: "2023-10-17",
    supplier: "Supplier C",
    supplierAddress: "789 Provider Rd, City, State 12345",
    supplierEmail: "finance@supplierc.com",
    supplierPhone: "(555) 345-6789",
    amount: 2500.00,
    tax: 200.00,
    total: 2700.00,
    status: "Flagged",
    confidence: "low",
    confidenceIcon: "",
    confidenceScore: 80,
    numberOfUnits: 15,
    items: [
      { description: "Consulting Services", quantity: 10, unitPrice: 250.00, total: 2500.00 }
    ],
    notes: "Discrepancy in hours billed",
    approvalHistory: [
      { date: "2023-10-04", user: "John Doe", action: "Flagged", notes: "Hours don't match our records" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
};

// Initialize localStorage with mock data if it doesn't exist
export const initializeMockData = () => {
  if (!localStorage.getItem('invoices')) {
    localStorage.setItem('invoices', JSON.stringify(mockInvoices));
  }
  
  if (!localStorage.getItem('invoiceDetails')) {
    localStorage.setItem('invoiceDetails', JSON.stringify(mockInvoiceDetails));
  }
};

// Helper functions to work with the mock data
export const getInvoices = () => {
  const invoices = localStorage.getItem('invoices');
  return invoices ? JSON.parse(invoices) : [];
};

export const getInvoiceById = (id) => {
  const invoiceDetails = localStorage.getItem('invoiceDetails');
  const details = invoiceDetails ? JSON.parse(invoiceDetails) : {};
  return details[id] || null;
};

export const updateInvoice = (invoice) => {
  // Update in invoices list
  const invoices = getInvoices();
  const updatedInvoices = invoices.map(inv => 
    inv.id === invoice.id ? { ...inv, ...invoice } : inv
  );
  localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  
  // Update in invoice details
  const invoiceDetails = localStorage.getItem('invoiceDetails');
  const details = invoiceDetails ? JSON.parse(invoiceDetails) : {};
  details[invoice.id] = { ...details[invoice.id], ...invoice };
  localStorage.setItem('invoiceDetails', JSON.stringify(details));
  
  return invoice;
};

export const addInvoice = (invoice) => {
  // Generate a new ID
  const invoices = getInvoices();
  const newId = Math.max(...invoices.map(inv => inv.id), 0) + 1;
  const newInvoice = { ...invoice, id: newId };
  
  // Add to invoices list
  const updatedInvoices = [...invoices, newInvoice];
  localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  
  // Add to invoice details
  const invoiceDetails = localStorage.getItem('invoiceDetails');
  const details = invoiceDetails ? JSON.parse(invoiceDetails) : {};
  details[newId] = newInvoice;
  localStorage.setItem('invoiceDetails', JSON.stringify(details));
  
  return newInvoice;
};

// Email integration mock data
export const emailFolders = [
  { id: 1, name: "Inbox" },
  { id: 2, name: "Invoices" },
  { id: 3, name: "Receipts" },
  { id: 4, name: "Statements" }
];