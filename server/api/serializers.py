from rest_framework import serializers
from .models import Invoice, InvoiceDetail, InvoiceItem, ApprovalHistory, User, InvoiceInfo
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'picture']

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'total']

class ApprovalHistorySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ApprovalHistory
        fields = ['id', 'date', 'user', 'action', 'notes']

class InvoiceDetailSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    approval_history = ApprovalHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = InvoiceDetail
        fields = [
            'id', 'supplier_address', 'supplier_email', 'supplier_phone',
            'tax', 'total', 'notes', 'image_url', 'items', 'approval_history'
        ]

class InvoiceSerializer(serializers.ModelSerializer):
    details = InvoiceDetailSerializer(read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'date', 'due_date', 'supplier',
            'amount', 'status', 'confidence', 'confidence_score',
            'number_of_units', 'created_at', 'updated_at', 'details'
        ]

class InvoiceInfoListSerializer(serializers.ModelSerializer):
    """Serializer for listing invoices with basic information"""
    class Meta:
        model = InvoiceInfo
        fields = ['id', 'invoice_number', 'date', 'supplier', 'amount', 'status', 'number_of_units']

class InvoiceInfoDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed invoice information"""
    line_items = InvoiceItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = InvoiceInfo
        fields = [
            'id', 'invoice_number', 'date', 'due_date', 'supplier',
            'amount', 'status', 'confidence', 'confidence_score',
            'number_of_units', 'supplier_address', 'supplier_email',
            'supplier_phone', 'tax', 'total', 'notes', 'created_at',
            'updated_at', 'line_items'
        ]

class GoogleAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    google_id = serializers.CharField()
    name = serializers.CharField()
    picture = serializers.URLField(required=False, allow_blank=True)
    token = serializers.CharField()
