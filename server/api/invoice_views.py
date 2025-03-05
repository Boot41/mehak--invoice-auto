from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Invoice, InvoiceDetail, ApprovalHistory, InvoiceInfo, InvoiceItem
from .serializers import InvoiceSerializer, InvoiceDetailSerializer, InvoiceInfoListSerializer, InvoiceInfoDetailSerializer
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
import boto3
import json
import os
import requests
import logging
import tempfile
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import datetime
import uuid
import PyPDF2

logger = logging.getLogger(__name__)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

AWS_BUCKET_NAME = "invoice-auto-12"
AWS_REGION = "ap-south-1"

s3_client = boto3.client(
    "s3",
    aws_access_key_id="AKIA34AMDGM567KHYA6Q",
    aws_secret_access_key="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",
    region_name=AWS_REGION,
)

def extract_text_from_file(file_path):
    """
    Extract text from a PDF file using PyPDF2
    """
    try:
        text = ""
        with open(file_path, 'rb') as file:
            # Create PDF reader object
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Extract text from each page
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return None

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_invoice(request):
    try:
        if 'document' not in request.FILES:
            return Response(
                {'error': 'No pdf file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        doc_file = request.FILES['document']
        
        # Validate file type
        if not doc_file.name.endswith('.pdf'):
            return Response(
                {'error': 'Only PDF files are allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate a unique filename
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = uuid.uuid4().hex[:8]
        doc_key = f"invoices/{timestamp}_{unique_id}_{doc_file.name}"

        try:
            # Upload to S3
            s3_client.upload_fileobj(
                doc_file,
                AWS_BUCKET_NAME,
                doc_key,
                ExtraArgs={'ContentType': 'application/pdf'}
            )
            
            # Generate URL
            doc_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{doc_key}"
            
            return Response({
                'url': doc_url,
                'message': 'Document uploaded successfully'
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error uploading to S3: {str(e)}")
            return Response(
                {'error': 'Failed to upload document to S3'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    except Exception as e:
        logger.error(f"Error in upload_invoice: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_invoices(request):
    """
    List all invoices with pagination.
    Returns basic invoice information: Invoice #, Date, Supplier, Amount, Status, Units
    """
    try:
        # Get invoices for the authenticated user
        invoices = InvoiceInfo.objects.filter(user=request.user).order_by('-created_at')
        
        # Initialize paginator
        paginator = StandardResultsSetPagination()
        paginated_invoices = paginator.paginate_queryset(invoices, request)
        
        # Serialize the paginated data
        serializer = InvoiceInfoListSerializer(paginated_invoices, many=True)
        
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
    Retrieve detailed information for a specific invoice.
    """
    try:
        invoice = get_object_or_404(InvoiceInfo, id=id, user=request.user)
        serializer = InvoiceInfoDetailSerializer(invoice)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_invoice(request):
    """
    Approve an invoice and update its status
    """
    try:
        invoice_data = request.data
        if not invoice_data:
            return Response({'error': 'Invoice data is required'}, status=status.HTTP_400_BAD_REQUEST)

        invoice_number = invoice_data.get('invoice_number')
        if not invoice_number:
            return Response({'error': 'Invoice number is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create invoice record
        invoice = InvoiceInfo.objects.create(
            invoice_number=invoice_data.get('invoice_number', None),
            date=invoice_data.get('date', None) or datetime.date.today(),
            due_date=invoice_data.get('due_date', None) or datetime.date.today(),
            supplier=invoice_data.get('supplier', None) or 'Unknown',
            amount=invoice_data.get('amount', None) or 0,
            status='Approved',
            confidence=invoice_data.get('confidence', None) or 'medium',
            confidence_score=invoice_data.get('confidence_score', None) or 50,
            number_of_units=invoice_data.get('number_of_units', None) or 0,
            supplier_address=invoice_data.get('supplier_address', None) or '',
            supplier_email=invoice_data.get('supplier_email', None) or '',
            supplier_phone=invoice_data.get('supplier_phone', None) or '',
            tax=invoice_data.get('tax', None) or 0,
            total=invoice_data.get('total', None) or 0,
            notes=invoice_data.get('notes', None) or '',
            user=request.user
        )

        # Create line items
        for item in invoice_data.get('line_items', []):
            InvoiceItem.objects.create(
                invoice=invoice,
                description=item.get('description', ''),
                quantity=item.get('quantity', 0),
                unit_price=item.get('unit_price', 0),
                total=item.get('total', 0)
            )

        return Response({
            'message': 'Invoice approved successfully',
            'invoice_number': invoice.invoice_number
        })

    except Exception as e:
        logger.error(f"Error approving invoice: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_invoice(request):
    """
    Process an invoice PDF using Groq API and return the extracted information
    """
    try:
        pdf_url = request.data.get('pdf_url')
        if not pdf_url:
            return Response(
                {'error': 'PDF URL is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Download the PDF file
        response = requests.get(pdf_url)
        if response.status_code != 200:
            raise Exception('Failed to download PDF file')

        # Save PDF temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(response.content)
            temp_path = temp_file.name

        try:
            # Extract text from PDF
            text = extract_text_from_file(temp_path)
            if not text:
                raise Exception('No text could be extracted from the PDF')

            # Process with Groq
            groq_api_key = os.getenv('GROQ_API_KEY')
            if not groq_api_key:
                raise Exception('GROQ_API_KEY not found in environment')

            prompt = f"""Analyze this invoice text and extract the following information in JSON format:
            - invoice_number: Invoice number (e.g., INV-2023-XXX)
            - date: Invoice date (YYYY-MM-DD)
            - due_date: Due date (YYYY-MM-DD)
            - supplier: Company name
            - amount: Subtotal before tax
            - tax: Tax amount
            - total: Total amount including tax
            - supplier_address: Full address
            - supplier_email: Email if present
            - supplier_phone: Phone if present
            - number_of_units: Total number of items
            - confidence: Extraction confidence (high/medium/low)
            - confidence_score: Score 0-100
            - line_items: Array of items with:
              - description: Item description
              - quantity: Number of units
              - unit_price: Price per unit
              - total: Total for this item
            - notes: Any important notes

            Text: {text}"""

            groq_response = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {groq_api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an expert at analyzing invoices and extracting structured information from them. Return data in valid JSON format."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "model": "mixtral-8x7b-32768",
                    "temperature": 0.1,
                    "max_tokens": 4000
                }
            )

            if groq_response.status_code != 200:
                raise Exception('Failed to process with Groq API')

            # Parse the response to get the actual JSON content
            response_data = groq_response.json()
            extracted_info = response_data['choices'][0]['message']['content']
            
            try:
                # Validate that we got valid JSON
                invoice_data = json.loads(extracted_info)
                return Response(invoice_data)
            except json.JSONDecodeError as e:
                raise Exception(f'Failed to parse Groq API response as JSON: {str(e)}')

        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)

    except Exception as e:
        logger.error(f"Error processing invoice: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
