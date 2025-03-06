import pytest
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from google.oauth2 import id_token

@pytest.mark.django_db
class TestGoogleAuth:
    def test_google_auth_missing_code(self, api_client):
        url = reverse('google_auth')
        response = api_client.post(url, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_invalid_token(self, mock_verify, api_client):
        mock_verify.side_effect = ValueError("Invalid token")
        url = reverse('google_auth')
        response = api_client.post(url, {'code': 'invalid_code'})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_success(self, mock_verify, api_client):
        mock_verify.return_value = {
            'sub': '123',
            'email': 'test@example.com',
            'name': 'Test User'
        }
        url = reverse('google_auth')
        response = api_client.post(url, {'code': 'valid_code'})
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_existing_user(self, mock_verify, api_client, test_user):
        mock_verify.return_value = {
            'sub': '123',
            'email': test_user.email,
            'name': test_user.username
        }
        url = reverse('google_auth')
        response = api_client.post(url, {'code': 'valid_code'})
        assert response.status_code == status.HTTP_200_OK
