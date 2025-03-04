import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models import User
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

@pytest.fixture
def api_client():
    client = APIClient()
    client.credentials()  # Clear any existing credentials
    return client

@pytest.fixture
def valid_google_data():
    return {
        'email': 'test@example.com',
        'google_id': '123456789',
        'name': 'Test User',
        'picture': 'https://example.com/picture.jpg',
        'token': 'valid_token_123'
    }

@pytest.fixture(autouse=True)
def disable_middleware(settings):
    # Store original middleware and settings
    original_middleware = settings.MIDDLEWARE
    original_cors = getattr(settings, 'CORS_ORIGIN_ALLOW_ALL', False)
    
    # Remove rate limit middleware for all tests except rate limit test
    settings.MIDDLEWARE = [
        m for m in settings.MIDDLEWARE
        if not m.endswith('ratelimit.middleware.RatelimitMiddleware')
    ]
    
    # Allow all CORS origins for testing
    settings.CORS_ORIGIN_ALLOW_ALL = True
    
    # Configure rate limit settings
    settings.RATELIMIT_ENABLE = True
    settings.RATELIMIT_USE_CACHE = 'default'
    
    # Configure REST Framework settings
    settings.REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': [],
        'DEFAULT_PERMISSION_CLASSES': [],
    }
    
    yield
    
    # Restore original settings
    settings.MIDDLEWARE = original_middleware
    settings.CORS_ORIGIN_ALLOW_ALL = original_cors

@pytest.mark.django_db
class TestGoogleAuthAPI:
    """Test cases for Google Authentication API endpoint."""
    
    def test_successful_authentication_new_user(self, api_client, valid_google_data):
        """Test successful authentication for a new user."""
        url = reverse('google_auth')
        response = api_client.post(url, valid_google_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access_token' in response.data
        assert 'refresh_token' in response.data
        assert 'user' in response.data
        assert response.data['user']['email'] == valid_google_data['email']
        assert response.data['user']['name'] == valid_google_data['name']
        assert response.data['user']['picture'] == valid_google_data['picture']

        # Verify user was created in database
        user = User.objects.get(email=valid_google_data['email'])
        assert user.email == valid_google_data['email']
        assert user.google_id == valid_google_data['google_id']

    def test_successful_authentication_existing_user(self, api_client, valid_google_data):
        """Test successful authentication for an existing user with updated info."""
        # First create the user
        url = reverse('google_auth')
        api_client.post(url, valid_google_data, format='json')

        # Update user data
        valid_google_data['name'] = 'Updated Name'
        valid_google_data['picture'] = 'https://example.com/new_picture.jpg'
        
        response = api_client.post(url, valid_google_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['user']['name'] == 'Updated Name'
        assert response.data['user']['picture'] == 'https://example.com/new_picture.jpg'

    def test_missing_required_fields(self, api_client, valid_google_data):
        """Test authentication with missing required fields."""
        required_fields = ['email', 'google_id', 'name', 'token']
        url = reverse('google_auth')

        for field in required_fields:
            data = valid_google_data.copy()
            del data[field]
            response = api_client.post(url, data, format='json')
            assert response.status_code == status.HTTP_400_BAD_REQUEST
            assert field in str(response.data['details'])

    def test_invalid_email_formats(self, api_client, valid_google_data):
        """Test authentication with invalid email formats."""
        url = reverse('google_auth')
        invalid_emails = [
            'invalid',  # No domain
            '@nodomain',  # No username
            'no@domain',  # Invalid domain
            'spaces in@email.com',  # Spaces in email
            'a' * 256 + '@toolong.com',  # Too long email
            '@.com',  # Missing username
            'user@',  # Missing domain
            'user@.',  # Invalid domain
            'user.@domain.com',  # Invalid username
            '@domain.com',  # Missing username
        ]

        for email in invalid_emails:
            data = valid_google_data.copy()
            data['email'] = email
            response = api_client.post(url, data, format='json')
            assert response.status_code == status.HTTP_400_BAD_REQUEST
            assert 'email' in str(response.data['details'])

    def test_empty_or_invalid_values(self, api_client, valid_google_data):
        """Test authentication with empty or invalid values."""
        url = reverse('google_auth')
        fields_to_test = {
            'email': ['', None, ' ', '\t', '\n'],
            'google_id': ['', None, ' '],
            'name': ['', None, ' ', '\t', '\n'],
            'token': ['', None, ' ']
        }

        for field, values in fields_to_test.items():
            for value in values:
                data = valid_google_data.copy()
                data[field] = value
                response = api_client.post(url, data, format='json')
                assert response.status_code == status.HTTP_400_BAD_REQUEST
                assert field in str(response.data['details'])

    def test_malformed_request_data(self, api_client):
        """Test authentication with malformed request data."""
        url = reverse('google_auth')
        malformed_data = [
            None,  # None data
            {},  # Empty data
            {'random': 'data'},  # Invalid fields
            [],  # List instead of dict
            'string',  # String instead of dict
            123,  # Number instead of dict
        ]

        for data in malformed_data:
            response = api_client.post(url, data, format='json')
            assert response.status_code == status.HTTP_400_BAD_REQUEST

    @pytest.mark.django_db
    def test_rate_limiting(self, api_client, valid_google_data, settings):
        """Test rate limiting functionality."""
        # Enable rate limiting middleware for this test
        settings.MIDDLEWARE.append('django_ratelimit.middleware.RatelimitMiddleware')
        
        url = reverse('google_auth')
        
        # Make 5 requests (should be allowed)
        for _ in range(5):
            response = api_client.post(url, valid_google_data, format='json')
            assert response.status_code == status.HTTP_200_OK
        
        # The 6th request should be rate limited
        response = api_client.post(url, valid_google_data, format='json')
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        assert 'Too many login attempts' in str(response.data['error'])

    def test_special_characters(self, api_client, valid_google_data):
        """Test authentication with special characters in fields."""
        url = reverse('google_auth')
        special_chars = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/~`"
        
        data = valid_google_data.copy()
        data['name'] = f"Test {special_chars} User"
        response = api_client.post(url, data, format='json')
        
        # Special characters should be allowed in names
        assert response.status_code == status.HTTP_200_OK
        assert response.data['user']['name'] == f"Test {special_chars} User"

    def test_unicode_characters(self, api_client, valid_google_data):
        """Test authentication with Unicode characters in fields."""
        url = reverse('google_auth')
        unicode_names = [
            "José García",  # Spanish
            "明美 田中",    # Japanese
            "Σωκράτης",    # Greek
            "Владимир",    # Russian
            "محمد",        # Arabic
        ]

        for name in unicode_names:
            data = valid_google_data.copy()
            data['name'] = name
            response = api_client.post(url, data, format='json')
            assert response.status_code == status.HTTP_200_OK
            assert response.data['user']['name'] == name
