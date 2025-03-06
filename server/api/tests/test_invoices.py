import pytest
from django.urls import reverse
from rest_framework import status
from api.models import InvoiceInfo, InvoiceItem

@pytest.mark.django_db
class TestInvoiceList:
    def test_list_invoices_unauthorized(self, api_client):
        url = reverse('list_invoices')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_invoices_empty(self, auth_client):
        # Delete any existing invoices
        InvoiceInfo.objects.all().delete()
        
        url = reverse('list_invoices')
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

    def test_list_invoices_with_data(self, auth_client, test_user, test_invoice_data):
        # Delete any existing invoices
        InvoiceInfo.objects.all().delete()
        
        # Create test invoice
        invoice = InvoiceInfo.objects.create(
            user=test_user,
            **{k: v for k, v in test_invoice_data.items() if k != 'line_items'}
        )
        
        # Create line items
        for item in test_invoice_data['line_items']:
            InvoiceItem.objects.create(invoice=invoice, **item)
        
        url = reverse('list_invoices')
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        
        invoice_data = response.data[0]
        assert invoice_data['invoice_number'] == test_invoice_data['invoice_number']
        assert invoice_data['supplier'] == test_invoice_data['supplier']
        assert float(invoice_data['amount']) == float(test_invoice_data['amount'])


@pytest.mark.django_db
class TestInvoiceDetail:
    def test_get_invoice_unauthorized(self, api_client):
        url = reverse('get_invoice', args=[1])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_invoice_not_found(self, auth_client):
        url = reverse('get_invoice', args=[99999])
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_invoice_success(self, auth_client, test_user, test_invoice_data):
        # Delete any existing invoices
        InvoiceInfo.objects.all().delete()
        
        # Create test invoice
        invoice = InvoiceInfo.objects.create(
            user=test_user,
            **{k: v for k, v in test_invoice_data.items() if k != 'line_items'}
        )
        
        # Create line items
        for item in test_invoice_data['line_items']:
            InvoiceItem.objects.create(invoice=invoice, **item)
        
        url = reverse('get_invoice', args=[invoice.id])
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        
        assert response.data['invoice_number'] == test_invoice_data['invoice_number']
        assert response.data['supplier'] == test_invoice_data['supplier']
        assert float(response.data['amount']) == float(test_invoice_data['amount'])
        assert len(response.data['line_items']) == len(test_invoice_data['line_items'])
        
        first_item = response.data['line_items'][0]
        test_item = test_invoice_data['line_items'][0]
        assert first_item['description'] == test_item['description']
        assert float(first_item['quantity']) == float(test_item['quantity'])
        assert float(first_item['unit_price']) == float(test_item['unit_price'])
        assert float(first_item['total']) == float(test_item['total'])

    def test_get_other_user_invoice(self, auth_client, other_user, test_invoice_data):
        # Create invoice for other user
        invoice = InvoiceInfo.objects.create(
            user=other_user,
            **{k: v for k, v in test_invoice_data.items() if k != 'line_items'}
        )
        
        url = reverse('get_invoice', args=[invoice.id])
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
