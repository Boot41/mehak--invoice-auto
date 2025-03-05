import json
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import InvoiceInfo
from datetime import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Load combined mock data into InvoiceInfo table'

    def handle(self, *args, **kwargs):
        # First, ensure we have at least one user
        user, created = User.objects.get_or_create(
            email='demo@example.com',
            defaults={
                'username': 'demo',
                'first_name': 'Demo',
                'last_name': 'User',
                'is_active': True
            }
        )
        
        # Clear existing data
        InvoiceInfo.objects.all().delete()
        
        # Get the absolute path to the JSON file
        current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        json_file_path = os.path.join(current_dir, 'data', 'combined_mock_data.json')
        
        # Load the combined mock data
        with open(json_file_path, 'r') as f:
            invoices_data = json.load(f)
        
        # Create InvoiceInfo objects
        for invoice_data in invoices_data:
            try:
                # Convert date strings to datetime objects
                date = datetime.strptime(invoice_data['date'], '%Y-%m-%d').date()
                due_date = datetime.strptime(invoice_data['dueDate'], '%Y-%m-%d').date()
                
                # Create InvoiceInfo object
                invoice_info = InvoiceInfo.objects.create(
                    user=user,
                    invoice_number=invoice_data['invoiceNumber'],
                    date=date,
                    due_date=due_date,
                    supplier=invoice_data['supplier'],
                    amount=invoice_data['amount'],
                    status=invoice_data['status'],
                    confidence=invoice_data['confidence'].lower(),
                    confidence_score=invoice_data['confidenceScore'],
                    number_of_units=invoice_data['numberOfUnits'],
                    supplier_address=invoice_data.get('supplierAddress', ''),
                    supplier_email=invoice_data.get('supplierEmail', 'supplier@example.com'),
                    supplier_phone=invoice_data.get('supplierPhone', ''),
                    tax=invoice_data.get('tax', 0.00),
                    total=invoice_data.get('total', invoice_data['amount']),
                    notes=invoice_data.get('notes', ''),
                    image_url=invoice_data.get('imageUrl', '')
                )
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created InvoiceInfo object for invoice {invoice_info.invoice_number}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to create InvoiceInfo object for invoice {invoice_data["invoiceNumber"]}: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully loaded all mock data into InvoiceInfo table')
        )
