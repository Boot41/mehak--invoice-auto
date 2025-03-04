import json
from django.core.management.base import BaseCommand
from api.models import Invoice, InvoiceDetail, ApprovalHistory, User
import logging
from django.utils.timezone import make_aware
from datetime import datetime
from django.db import transaction

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Load mock invoice data into the database'

    def handle(self, *args, **options):
        try:
            # Get the specific user
            user = User.objects.get(email='mehak.khanna@think41.com')

            with transaction.atomic():
                # Clear existing data for this user
                Invoice.objects.filter(user=user).delete()

                with open('/home/mehak/Documents/task3-boot41/server/data/mock_data.json', 'r') as file:
                    data = json.load(file)

                # Process mockInvoiceDetails first
                for invoice_id, detail_data in data['mockInvoiceDetails'].items():
                    self._create_invoice_with_details(detail_data, user)

                # Process any remaining mockInvoices that don't have details
                existing_numbers = InvoiceDetail.objects.values_list('invoice__invoice_number', flat=True)
                for invoice_data in data['mockInvoices']:
                    if invoice_data['invoiceNumber'] not in existing_numbers:
                        self._create_invoice(invoice_data, user)

                self.stdout.write(self.style.SUCCESS('Successfully loaded mock data'))
        except Exception as e:
            logger.error(f'Error loading mock data: {str(e)}')
            self.stdout.write(self.style.ERROR(f'Error loading mock data: {str(e)}'))

    def _create_invoice_with_details(self, data, user):
        try:
            # Create the base invoice
            invoice = Invoice.objects.create(
                user=user,
                invoice_number=data['invoiceNumber'],
                date=data['date'],
                due_date=data['dueDate'],
                supplier=data['supplier'],
                amount=data['amount'],
                status=data['status'],
                confidence=data['confidence'],
                confidence_score=data['confidenceScore'],
                number_of_units=data['numberOfUnits']
            )

            # Create the invoice detail
            detail = InvoiceDetail.objects.create(
                invoice=invoice,
                supplier_address=data['supplierAddress'],
                supplier_email=data['supplierEmail'],
                supplier_phone=data['supplierPhone'],
                tax=data['tax'],
                total=data['total'],
                notes=data.get('notes', ''),
                image_url=data.get('imageUrl', '')
            )

            # Create approval history entries
            for history_entry in data.get('approvalHistory', []):
                approval_date = make_aware(datetime.strptime(history_entry['date'], '%Y-%m-%d'))
                ApprovalHistory.objects.create(
                    invoice_detail=detail,
                    user=user,  # Using the same user for now
                    date=approval_date,
                    action=history_entry['action'],
                    notes=history_entry['notes']
                )

            logger.info(f'Successfully created invoice {data["invoiceNumber"]} with details')
        except Exception as e:
            logger.error(f'Error creating invoice with details: {str(e)}')
            raise

    def _create_invoice(self, invoice_data, user):
        try:
            Invoice.objects.create(
                user=user,
                invoice_number=invoice_data['invoiceNumber'],
                date=invoice_data['date'],
                due_date=invoice_data['dueDate'],
                supplier=invoice_data['supplier'],
                amount=invoice_data['amount'],
                status=invoice_data['status'],
                confidence=invoice_data['confidence'],
                confidence_score=invoice_data['confidenceScore'],
                number_of_units=invoice_data['numberOfUnits']
            )
        except Exception as e:
            logger.error(f'Error creating invoice: {str(e)}')
