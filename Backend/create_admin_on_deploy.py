#!/usr/bin/env python
"""
Script to create admin user during deployment
This will be run as part of the build process
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin():
    try:
        # Check if admin already exists
        if User.objects.filter(username='admin').exists():
            print("Admin user already exists")
            return
        
        # Create admin user
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@youmatter.com',
            password='YouMatter2024!'
        )
        print("Admin user created successfully!")
        print("Username: admin")
        print("Password: YouMatter2024!")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")

if __name__ == "__main__":
    create_admin()