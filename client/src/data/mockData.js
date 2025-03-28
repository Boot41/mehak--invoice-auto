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
  },
  {
    id: 9,
    invoiceNumber: "INV-2023-009",
    date: "2023-10-09",
    dueDate: "2023-10-23",
    supplier: "Supplier I",
    amount: 3000.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 85,
    numberOfUnits: 10
  },
  {
    id: 10,
    invoiceNumber: "INV-2023-010",
    date: "2023-10-10",
    dueDate: "2023-10-24",
    supplier: "Supplier J",
    amount: 400.00,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 90,
    numberOfUnits: 2
  },
  {
    id: 11,
    invoiceNumber: "INV-2023-011",
    date: "2023-10-11",
    dueDate: "2023-10-25",
    supplier: "Supplier K",
    amount: 1500.50,
    status: "Flagged",
    confidence: "low",
    confidenceIcon: "",
    confidenceScore: 70,
    numberOfUnits: 5
  },
  {
    id: 12,
    invoiceNumber: "INV-2023-012",
    date: "2023-10-12",
    dueDate: "2023-10-26",
    supplier: "Supplier L",
    amount: 2000.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 75,
    numberOfUnits: 8
  },
  {
    id: 13,
    invoiceNumber: "INV-2023-013",
    date: "2023-10-13",
    dueDate: "2023-10-27",
    supplier: "Supplier M",
    amount: 3500.00,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 95,
    numberOfUnits: 15
  },
  {
    id: 14,
    invoiceNumber: "INV-2023-014",
    date: "2023-10-14",
    dueDate: "2023-10-28",
    supplier: "Supplier N",
    amount: 500.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 80,
    numberOfUnits: 6
  },
  {
    id: 15,
    invoiceNumber: "INV-2023-015",
    date: "2023-10-15",
    dueDate: "2023-10-29",
    supplier: "Supplier O",
    amount: 1200.00,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 90,
    numberOfUnits: 7
  },
  {
    id: 16,
    invoiceNumber: "INV-2023-016",
    date: "2023-10-16",
    dueDate: "2023-10-30",
    supplier: "Supplier P",
    amount: 800.00,
    status: "Flagged",
    confidence: "low",
    confidenceIcon: "",
    confidenceScore: 60,
    numberOfUnits: 4
  },
  {
    id: 17,
    invoiceNumber: "INV-2023-017",
    date: "2023-10-17",
    dueDate: "2023-10-31",
    supplier: "Supplier Q",
    amount: 2700.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 85,
    numberOfUnits: 9
  },
  {
    id: 18,
    invoiceNumber: "INV-2023-018",
    date: "2023-10-18",
    dueDate: "2023-11-01",
    supplier: "Supplier R",
    amount: 950.00,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 95,
    numberOfUnits: 11
  },
  {
    id: 19,
    invoiceNumber: "INV-2023-019",
    date: "2023-10-19",
    dueDate: "2023-11-02",
    supplier: "Supplier S",
    amount: 1500.00,
    status: "Flagged",
    confidence: "low",
    confidenceIcon: "",
    confidenceScore: 70,
    numberOfUnits: 5
  },
  {
    id: 20,
    invoiceNumber: "INV-2023-020",
    date: "2023-10-20",
    dueDate: "2023-11-03",
    supplier: "Supplier T",
    amount: 2200.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 80,
    numberOfUnits: 10
  },
  {
    id: 21,
    invoiceNumber: "INV-2023-021",
    date: "2023-10-21",
    dueDate: "2023-11-04",
    supplier: "Supplier U",
    amount: 1750.00,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 90,
    numberOfUnits: 12
  },
  {
    id: 22,
    invoiceNumber: "INV-2023-022",
    date: "2023-10-22",
    dueDate: "2023-11-05",
    supplier: "Supplier V",
    amount: 3000.00,
    status: "Flagged",
    confidence: "low",
    confidenceIcon: "",
    confidenceScore: 65,
    numberOfUnits: 8
  },
  {
    id: 23,
    invoiceNumber: "INV-2023-023",
    date: "2023-10-23",
    dueDate: "2023-11-06",
    supplier: "Supplier W",
    amount: 850.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 75,
    numberOfUnits: 9
  },
  {
    id: 24,
    invoiceNumber: "INV-2023-024",
    date: "2023-10-24",
    dueDate: "2023-11-07",
    supplier: "Supplier X",
    amount: 1200.00,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 92,
    numberOfUnits: 6
  },
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
  },
  4: {
    id: 4,
    invoiceNumber: "INV-2023-004",
    date: "2023-10-04",
    dueDate: "2023-10-18",
    supplier: "Supplier D",
    supplierAddress: "123 Business St, City, State 12345",
    supplierEmail: "accounts@suppliera.com",
    supplierPhone: "(555) 456-7890",
    amount: 1800.75,
    tax: 150.00,
    total: 1950.75,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 85,
    numberOfUnits: 8,
    items: [
      { description: "Product C", quantity: 3, unitPrice: 200.00, total: 600.00 },
      { description: "Service D", quantity: 4, unitPrice: 300.00, total: 1200.00 }
    ],
    notes: "Payment due in 30 days",
    approvalHistory: [],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  5: {
    id: 5,
    invoiceNumber: "INV-2023-005",
    date: "2023-10-05",
    dueDate: "2023-10-19",
    supplier: "Supplier E",
    supplierAddress: "456 Vendor Ave, City, State 12345",
    supplierEmail: "billing@supplierb.com",
    supplierPhone: "(555) 234-5678",
    amount: 950.25,
    tax: 75.00,
    total: 1025.25,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 92,
    numberOfUnits: 12,
    items: [
      { description: "Monthly Subscription", quantity: 1, unitPrice: 950.25, total: 950.25 }
    ],
    notes: "Paid in full",
    approvalHistory: [
      { date: "2023-10-06", user: "John Doe", action: "Approved", notes: "Payment received" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  6: {
    id: 6,
    invoiceNumber: "INV-2023-006",
    date: "2023-10-06",
    dueDate: "2023-10-20",
    supplier: "Supplier F",
    supplierAddress: "789 Provider Rd, City, State 12345",
    supplierEmail: "finance@supplierc.com",
    supplierPhone: "(555) 345-6789",
    amount: 3200.00,
    tax: 250.00,
    total: 3450.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 88,
    numberOfUnits: 20,
    items: [
      { description: "Consulting Services", quantity: 8, unitPrice: 400.00, total: 3200.00 }
    ],
    notes: "Payment terms net 30",
    approvalHistory: [],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  7: {
    id: 7,
    invoiceNumber: "INV-2023-007",
    date: "2023-10-07",
    dueDate: "2023-10-21",
    supplier: "Supplier G",
    supplierAddress: "123 Business St, City, State 12345",
    supplierEmail: "accounts@suppliera.com",
    supplierPhone: "(555) 123-4567",
    amount: 1500.50,
    tax: 100.00,
    total: 1600.50,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 96,
    numberOfUnits: 18,
    items: [
      { description: "Product E", quantity: 5, unitPrice: 300.00, total: 1500.00 }
    ],
    notes: "Paid in full",
    approvalHistory: [
      { date: "2023-10-08", user: "John Doe", action: "Approved", notes: "Payment received" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  8: {
    id: 8,
    invoiceNumber: "INV-2023-008",
    date: "2023-10-08",
    dueDate: "2023-10-22",
    supplier: "Supplier H",
    supplierAddress: "456 Vendor Ave, City, State 12345",
    supplierEmail: "billing@supplierb.com",
    supplierPhone: "(555) 234-5678",
    amount: 2100.25,
    tax: 150.00,
    total: 2250.25,
    status: "Flagged",
    confidence: "low",
    confidenceIcon: "",
    confidenceScore: 78,
    numberOfUnits: 22,
    items: [
      { description: "Service F", quantity: 3, unitPrice: 700.00, total: 2100.00 }
    ],
    notes: "Discrepancy in service hours",
    approvalHistory: [],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  9: {
    id: 9,
    invoiceNumber: "INV-2023-009",
    date: "2023-10-09",
    dueDate: "2023-10-23",
    supplier: "Supplier I",
    supplierAddress: "123 Business St, City, State 12345",
    supplierEmail: "accounts@suppliera.com",
    supplierPhone: "(555) 123-4567",
    amount: 3000.00,
    tax: 200.00,
    total: 3200.00,
    status: "Pending",
    confidence: "medium",
    confidenceIcon: "",
    confidenceScore: 85,
    numberOfUnits: 10,
    items: [
      { description: "Product G", quantity: 10, unitPrice: 300.00, total: 3000.00 }
    ],
    notes: "Payment due in 30 days",
    approvalHistory: [],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  10: {
    id: 10,
    invoiceNumber: "INV-2023-010",
    date: "2023-10-10",
    dueDate: "2023-10-24",
    supplier: "Supplier J",
    supplierAddress: "456 Vendor Ave, City, State 12345",
    supplierEmail: "billing@supplierb.com",
    supplierPhone: "(555) 234-5678",
    amount: 400.00,
    tax: 30.00,
    total: 430.00,
    status: "Approved",
    confidence: "high",
    confidenceIcon: "",
    confidenceScore: 90,
    numberOfUnits: 2,
    items: [
      { description: "Monthly Subscription", quantity: 1, unitPrice: 400.00, total: 400.00 }
    ],
    notes: "Paid in full",
    approvalHistory: [
      { date: "2023-10-11", user: "John Doe", action: "Approved", notes: "Payment received" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
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