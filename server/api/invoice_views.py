from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Invoice, InvoiceDetail, ApprovalHistory
from .serializers import InvoiceSerializer, InvoiceDetailSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_invoices(request):
    """
    List all invoices with pagination.
    """
    try:
        invoices = Invoice.objects.filter(user=request.user).order_by('-created_at')
        
        # Initialize paginator
        paginator = StandardResultsSetPagination()
        paginated_invoices = paginator.paginate_queryset(invoices, request)
        
        # Serialize the paginated data
        serializer = InvoiceSerializer(paginated_invoices, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_invoice(request, id):
    """
    Retrieve a single invoice by ID with all its details.
    """
    try:
        invoice = get_object_or_404(Invoice, id=id, user=request.user)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)
    
    except Invoice.DoesNotExist:
        return Response(
            {'error': 'Invoice not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def approve_invoice(request, id):
    """
    Approve an invoice and create an approval history entry.
    """
    try:
        invoice = get_object_or_404(Invoice, id=id, user=request.user)
        
        # Check if invoice is already approved
        if invoice.status == 'Approved':
            return Response(
                {'error': 'Invoice is already approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update invoice status
        invoice.status = 'Approved'
        invoice.save()
        
        # Create approval history entry
        ApprovalHistory.objects.create(
            invoice_detail=invoice.details,
            user=request.user,
            action='Approved',
            notes=request.data.get('notes', '')
        )
        
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)
    
    except Invoice.DoesNotExist:
        return Response(
            {'error': 'Invoice not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_invoice(request):
    """
    Mock AI processing of an invoice.
    Returns hardcoded extracted fields.
    """
    try:
        # Simulate processing delay
        import time
        time.sleep(1)
        
        # Return mock AI processed data
        return Response({
            "extracted_data": {
                "invoice_number": "INV-2025-001",
                "date": "2025-03-04",
                "due_date": "2025-04-03",
                "supplier": "Tech Solutions Inc.",
                "supplier_address": "123 Tech Street, Silicon Valley, CA 94025",
                "supplier_email": "billing@techsolutions.com",
                "supplier_phone": "+1-555-0123",
                "items": [
                    {
                        "description": "High Performance Laptop",
                        "quantity": 2,
                        "unit_price": 1299.99,
                        "total": 2599.98
                    },
                    {
                        "description": "Extended Warranty",
                        "quantity": 2,
                        "unit_price": 199.99,
                        "total": 399.98
                    }
                ],
                "subtotal": 2999.96,
                "tax": 299.99,
                "total": 3299.95
            },
            "confidence_score": 95,
            "confidence": "high"
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
