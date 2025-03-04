import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def google_user_data():
    return {
        'email': 'test@example.com',
        'google_id': '123456789',
        'name': 'Test User',
        'picture': 'https://example.com/picture.jpg',
        'locale': 'en',
        'verified_email': True,
        'given_name': 'Test',
        'family_name': 'User'
    }

@pytest.mark.django_db
class TestGoogleAuthView:
    def test_successful_authentication(self, api_client, google_user_data):
        url = reverse('google_auth')
        response = api_client.post(url, google_user_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access_token' in response.data
        assert 'refresh_token' in response.data
        assert 'user' in response.data
        
        # Check user was created
        user = User.objects.get(email=google_user_data['email'])
        assert user.email == google_user_data['email']
        assert user.google_id == google_user_data['google_id']

    def test_invalid_data(self, api_client):
        url = reverse('google_auth')
        response = api_client.post(url, {}, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

    def test_missing_required_fields(self, api_client, google_user_data):
        url = reverse('google_auth')
        del google_user_data['email']  # Remove required field
        response = api_client.post(url, google_user_data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

    @pytest.mark.django_db
    def test_user_update(self, api_client, google_user_data):
        # First create the user
        url = reverse('google_auth')
        response = api_client.post(url, google_user_data, format='json')
        assert response.status_code == status.HTTP_200_OK

        # Update user data
        google_user_data['name'] = 'Updated Name'
        response = api_client.post(url, google_user_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        user = User.objects.get(email=google_user_data['email'])
        assert user.get_full_name() == 'Updated Name'

    def test_rate_limiting(self, api_client, google_user_data):
        url = reverse('google_auth')
        
        # Make 6 requests (rate limit is 5 per minute)
        for _ in range(5):
            response = api_client.post(url, google_user_data, format='json')
            assert response.status_code == status.HTTP_200_OK

        # 6th request should be rate limited
        response = api_client.post(url, google_user_data, format='json')
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
