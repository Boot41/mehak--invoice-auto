import json

# Load the mock data
with open('mock_data.json', 'r') as f:
    data = json.load(f)

mock_invoices = data['mockInvoices']
mock_invoice_details = data['mockInvoiceDetails']

# Create the combined invoices array
combined_invoices = []
for invoice in mock_invoices:
    invoice_id = str(invoice['id'])
    if invoice_id in mock_invoice_details:
        invoice_details = mock_invoice_details[invoice_id]
        combined_invoice = {**invoice, **invoice_details}
        combined_invoices.append(combined_invoice)
    else:
        combined_invoices.append(invoice)

# Write the combined data to a new JSON file
with open('combined_mock_data.json', 'w') as f:
    json.dump(combined_invoices, f, indent=4)

print('Combined mock data created successfully!')
