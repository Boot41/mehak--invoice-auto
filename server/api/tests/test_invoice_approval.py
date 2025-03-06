import pytest
from django.urls import reverse
from rest_framework import status
from api.models import InvoiceInfo, InvoiceItem

@pytest.mark.django_db
class TestApproveInvoice:
    def test_approve_invoice_unauthorized(self, api_client):
        url = reverse('approve_invoice')
        response = api_client.post(url, {})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_approve_invoice_no_data(self, auth_client):
        url = reverse('approve_invoice')
        response = auth_client.post(url, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_approve_invoice_missing_number(self, auth_client):
        url = reverse('approve_invoice')
        data = {
            'date': '2024-03-06',
            'supplier': 'Test Supplier',
            'amount': 100
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_approve_invoice_success(self, auth_client, test_invoice_data):
        # Delete any existing invoices first
        InvoiceInfo.objects.all().delete()
        
        url = reverse('approve_invoice')
        response = auth_client.post(url, test_invoice_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'invoice_number' in response.data
        
        # Verify invoice was created
        invoice = InvoiceInfo.objects.get(invoice_number=test_invoice_data['invoice_number'])
        assert invoice.status == 'Approved'
        assert invoice.supplier == test_invoice_data['supplier']
        assert float(invoice.amount) == float(test_invoice_data['amount'])
        
        # Verify line items were created
        line_items = invoice.line_items.all()
        assert len(line_items) == len(test_invoice_data['line_items'])
        
        first_item = line_items.first()
        test_item = test_invoice_data['line_items'][0]
        assert first_item.description == test_item['description']
        assert float(first_item.quantity) == float(test_item['quantity'])
        assert float(first_item.unit_price) == float(test_item['unit_price'])
        assert float(first_item.total) == float(test_item['total'])

    def test_approve_invoice_duplicate_number(self, auth_client, test_user, test_invoice_data):
        # Create an invoice first
        InvoiceInfo.objects.create(
            user=test_user,
            **{k: v for k, v in test_invoice_data.items() if k != 'line_items'}
        )

        # Try to create another invoice with same number
        url = reverse('approve_invoice')
        response = auth_client.post(url, test_invoice_data, format='json')
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    def test_approve_invoice_invalid_amounts(self, auth_client, test_invoice_data):
        test_invoice_data['amount'] = 'invalid'
        url = reverse('approve_invoice')
        response = auth_client.post(url, test_invoice_data, format='json')
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
