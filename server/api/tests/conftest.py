import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user():
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )
    return user

@pytest.fixture
def auth_client(api_client, test_user):
    refresh = RefreshToken.for_user(test_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client

@pytest.fixture
def test_invoice_data():
    return {
        "invoice_number": "INV-2024-TEST",
        "date": "2024-03-06",
        "due_date": "2024-04-06",
        "supplier": "Test Supplier",
        "amount": 1000.00,
        "tax": 100.00,
        "total": 1100.00,
        "supplier_address": "123 Test St",
        "supplier_email": "supplier@test.com",
        "supplier_phone": "123-456-7890",
        "number_of_units": 5,
        "confidence": "high",
        "confidence_score": 95,
        "line_items": [
            {
                "description": "Test Item",
                "quantity": 5,
                "unit_price": 200.00,
                "total": 1000.00
            }
        ],
        "notes": "Test invoice"
    }
