from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseForbidden
from django_ratelimit.decorators import ratelimit
from .serializers import GoogleAuthSerializer
from .models import User

@ratelimit(key='ip', rate='5/m', method=['POST'])
@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Endpoint for Google OAuth authentication.
    Rate limited to 5 requests per minute per IP address.
    Receives Google user data, creates/updates user, and returns JWT tokens.
    """
    # Check if request was rate limited
    if getattr(request, 'limited', False):
        return Response(
            {'error': 'Too many login attempts. Please try again later.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )
    
    serializer = GoogleAuthSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': 'Invalid data provided', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create or update user using the validated data
        user = User.objects.create_or_update_google_user(**serializer.validated_data)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'email': user.email,
                'name': user.get_full_name(),
                'picture': user.picture,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': 'Authentication failed', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
