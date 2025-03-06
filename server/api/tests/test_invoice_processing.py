import pytest
import json
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from unittest.mock import patch

@pytest.mark.django_db
class TestUploadInvoice:
    def test_upload_invoice_unauthorized(self, api_client):
        url = reverse('upload_invoice')
        response = api_client.post(url, {})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_upload_invoice_no_file(self, auth_client):
        url = reverse('upload_invoice')
        response = auth_client.post(url, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @patch('api.invoice_views.upload_to_s3')
    def test_upload_invoice_success(self, mock_upload, auth_client):
        url = reverse('upload_invoice')
        mock_upload.return_value = "test_file_key"
        
        # Create a test PDF file
        file_content = b'%PDF-1.4\nTest PDF content'
        test_file = SimpleUploadedFile(
            "test.pdf",
            file_content,
            content_type="application/pdf"
        )
        
        response = auth_client.post(url, {'file': test_file}, format='multipart')
        assert response.status_code == status.HTTP_200_OK
        assert 'file_key' in response.data
        assert response.data['file_key'] == "test_file_key"


@pytest.mark.django_db
class TestProcessInvoice:
    @patch('api.invoice_views.extract_text_from_pdf')
    @patch('api.invoice_views.process_with_groq')
    def test_process_invoice_success(self, mock_groq, mock_extract, auth_client):
        url = reverse('process_invoice')
        
        # Mock PDF text extraction
        mock_extract.return_value = "Test invoice content"
        
        # Mock Groq API response
        mock_groq.return_value = {
            "invoice_number": "INV-001",
            "date": "2024-03-06",
            "supplier": "Test Supplier",
            "amount": 100.00,
            "line_items": [
                {
                    "description": "Test Item",
                    "quantity": 1,
                    "unit_price": 100.00,
                    "total": 100.00
                }
            ]
        }
        
        data = {
            'file_key': 'test_file_key'
        }
        
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'invoice_data' in response.data
        
        invoice_data = response.data['invoice_data']
        assert invoice_data['invoice_number'] == "INV-001"
        assert invoice_data['supplier'] == "Test Supplier"
        assert float(invoice_data['amount']) == 100.00
        assert len(invoice_data['line_items']) == 1
        
        line_item = invoice_data['line_items'][0]
        assert line_item['description'] == "Test Item"
        assert float(line_item['quantity']) == 1
        assert float(line_item['unit_price']) == 100.00
        assert float(line_item['total']) == 100.00
