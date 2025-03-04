from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from . import auth_views

urlpatterns = [
    path('hello/', views.hello_api, name='hello_api'),
    
    # Authentication endpoints
    path('auth/google/', auth_views.google_auth, name='google_auth'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
