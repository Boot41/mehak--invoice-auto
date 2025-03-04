from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit
from django.views.decorators.csrf import csrf_exempt
from .models import User

REQUIRED_FIELDS = ['email', 'google_id', 'name', 'token']

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', method=['POST'], block=True)
def google_auth(request):
    """
    Authenticate user with Google OAuth2 credentials.
    
    Required fields:
    - email: User's email address
    - google_id: Google's unique identifier for the user
    - name: User's full name
    - token: Google OAuth2 token
    
    Optional fields:
    - picture: URL to user's Google profile picture
    
    Returns:
    - access_token: JWT access token
    - refresh_token: JWT refresh token
    - user: User profile information
    """
    try:
        # Input validation
        if not request.data or not isinstance(request.data, dict):
            return Response(
                {'details': 'Invalid request format. Expected JSON object.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for required fields
        missing_fields = [field for field in REQUIRED_FIELDS if not request.data.get(field)]
        if missing_fields:
            return Response(
                {'details': f'Missing required fields: {", ".join(missing_fields)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate email format
        email = request.data.get('email')
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {'details': 'Invalid email format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for empty or whitespace-only values
        for field in REQUIRED_FIELDS:
            value = request.data.get(field)
            if isinstance(value, str) and not value.strip():
                return Response(
                    {'details': f'{field} cannot be empty or whitespace'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Create or update user
        user = User.objects.create_or_update_google_user(
            google_id=request.data.get('google_id'),
            email=email,
            name=request.data.get('name'),
            picture=request.data.get('picture')
        )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'email': user.email,
                'name': f"{user.first_name} {user.last_name}".strip(),
                'picture': user.picture
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
