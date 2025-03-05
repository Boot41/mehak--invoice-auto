from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Invoice, InvoiceDetail, InvoiceItem, ApprovalHistory, InvoiceInfo

# Register your models here.

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('username', 'first_name', 'last_name')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'date', 'supplier', 'amount', 'status')
    list_filter = ('status', 'confidence')
    search_fields = ('invoice_number', 'supplier')

@admin.register(InvoiceDetail)
class InvoiceDetailAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'supplier_email', 'total')
    search_fields = ('invoice__invoice_number', 'supplier_email')

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0

@admin.register(InvoiceInfo)
class InvoiceInfoAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'supplier', 'date', 'total', 'status')
    list_filter = ('status', 'date')
    search_fields = ('invoice_number', 'supplier')
    inlines = [InvoiceItemInline]
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'invoice_number', 'date', 'due_date', 'supplier')
        }),
        ('Financial Details', {
            'fields': ('amount', 'tax', 'total', 'number_of_units')
        }),
        ('Status and Confidence', {
            'fields': ('status', 'confidence', 'confidence_score')
        }),
        ('Supplier Details', {
            'fields': ('supplier_address', 'supplier_email', 'supplier_phone')
        }),
        ('Additional Information', {
            'fields': ('notes', 'image_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'description', 'quantity', 'unit_price', 'total')
    search_fields = ('description', 'invoice__invoice_number')

@admin.register(ApprovalHistory)
class ApprovalHistoryAdmin(admin.ModelAdmin):
    list_display = ('invoice_detail', 'date', 'user', 'action')
    list_filter = ('action', 'date')
    search_fields = ('invoice_detail__invoice__invoice_number', 'user__email')
