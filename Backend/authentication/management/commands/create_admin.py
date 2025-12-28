from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a superuser for production'

    def handle(self, *args, **options):
        # Only create admin in production (when DEBUG=False)
        if os.environ.get('DEBUG', 'True').lower() == 'false':
            username = 'admin'
            email = 'admin@youmatter.com'
            password = 'YouMatter2024!'
            
            if not User.objects.filter(username=username).exists():
                User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                self.stdout.write(
                    self.style.SUCCESS(f'Production superuser "{username}" created successfully')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Superuser "{username}" already exists')
                )