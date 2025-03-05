from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from django.db.models import Q

class CustomUserManager(UserManager):
    def create_or_update_google_user(self, google_id, email, name, picture=None, **kwargs):
        """
        Creates or updates a user based on Google OAuth2 data.
        """
        try:
            # Try to find existing user by google_id or email
            user = self.get(Q(google_id=google_id) | Q(email=email))
            
            # Update user information
            user.email = email
            user.google_id = google_id
            if name:
                names = name.split(' ', 1)
                user.first_name = names[0]
                user.last_name = names[1] if len(names) > 1 else ''
            if picture:
                user.picture = picture
            user.save()
            
        except self.model.DoesNotExist:
            # Create new user
            username = email.split('@')[0]
            # Ensure username is unique
            base_username = username
            counter = 1
            while self.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            names = name.split(' ', 1)
            user = self.create(
                username=username,
                email=email,
                google_id=google_id,
                first_name=names[0],
                last_name=names[1] if len(names) > 1 else '',
                picture=picture,
                is_active=True
            )
        
        return user

class User(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser to support Google OAuth2 authentication.
    
    This model stores user profile data received from Google's OAuth2 API, while maintaining
    compatibility with Django's authentication system. Authentication is handled client-side,
    and this model focuses on storing and managing user profile data.
    """
    # Google OAuth2 specific fields
    google_id = models.CharField(
        max_length=100, 
        unique=True, 
        null=True, 
        help_text=_("Unique identifier from Google OAuth2")
    )
    picture = models.URLField(
        null=True, 
        blank=True, 
        help_text=_("Profile picture URL from Google")
    )
    locale = models.CharField(
        max_length=10, 
        null=True, 
        blank=True, 
        help_text=_("User's locale preference")
    )
    verified_email = models.BooleanField(
        default=False,
        help_text=_("Whether the email has been verified by Google")
    )
    
    # Override email field to make it required and unique
    email = models.EmailField(_('email address'), unique=True)
    
    # Make email required for login instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # Use custom manager
    objects = CustomUserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['google_id']),
        ]

    def __str__(self):
        return self.email

class Invoice(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='invoices')
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Flagged', 'Flagged'),
    ]
    
    CONFIDENCE_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    invoice_number = models.CharField(max_length=20, unique=True)
    date = models.DateField()
    due_date = models.DateField()
    supplier = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    confidence = models.CharField(max_length=10, choices=CONFIDENCE_CHOICES)
    confidence_score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    number_of_units = models.IntegerField(validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.invoice_number

class InvoiceDetail(models.Model):
    invoice = models.OneToOneField(
        Invoice,
        on_delete=models.CASCADE,
        related_name='details'
    )
    supplier_address = models.TextField()
    supplier_email = models.EmailField()
    supplier_phone = models.CharField(max_length=20)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    image_url = models.URLField(blank=True)

    def __str__(self):
        return f"Details for {self.invoice.invoice_number}"

class InvoiceItem(models.Model):
    description = models.CharField(max_length=255)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    invoice = models.ForeignKey('InvoiceInfo', related_name='items', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.description} - {self.quantity} units"

class ApprovalHistory(models.Model):
    invoice_detail = models.ForeignKey(
        InvoiceDetail,
        on_delete=models.CASCADE,
        related_name='approval_history'
    )
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.action} by {self.user} on {self.date}"

    class Meta:
        verbose_name_plural = "Approval histories"

class InvoiceInfo(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ]

    CONFIDENCE_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low')
    ]

    invoice_number = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    supplier = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    confidence = models.CharField(max_length=20, choices=CONFIDENCE_CHOICES)
    confidence_score = models.IntegerField()
    number_of_units = models.IntegerField()
    supplier_address = models.TextField(blank=True)
    supplier_email = models.EmailField(blank=True)
    supplier_phone = models.CharField(max_length=20, blank=True)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    image_url = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.supplier}"

    class Meta:
        ordering = ['-created_at']
