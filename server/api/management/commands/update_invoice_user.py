from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import InvoiceInfo

User = get_user_model()

class Command(BaseCommand):
    help = 'Update all invoices to use a specific user'

    def handle(self, *args, **kwargs):
        try:
            # Get or create the target user
            user_email = 'mehak.khanna@think41.com'
            user, created = User.objects.get_or_create(
                email=user_email,
                defaults={
                    'first_name': 'Mehak',
                    'last_name': 'Khanna',
                }
            )

            # Update all invoices to use this user
            InvoiceInfo.objects.all().update(user=user)
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully updated all invoices to user: {user_email}')
            )
        
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error updating invoices: {str(e)}')
            )
