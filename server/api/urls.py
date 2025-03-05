from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, auth_views, invoice_views

urlpatterns = [
    # Authentication endpoints
    path('auth/google/', auth_views.google_auth, name='google_auth'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Invoice Management URLs
    path('invoices/', invoice_views.list_invoices, name='list_invoices'),
    path('invoices/<int:id>/', invoice_views.get_invoice, name='get_invoice'),
    path('process-invoice/', invoice_views.process_invoice, name='process_invoice'),
    path('upload-invoice/', invoice_views.upload_invoice, name='upload_invoice'),
    path('approve-invoice/', invoice_views.approve_invoice, name='approve_invoice'),
]
