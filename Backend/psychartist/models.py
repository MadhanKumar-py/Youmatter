from django.db import models
from django.conf import settings

class PsychartistApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    # User who applied
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='psychartist_application')
    
    # Personal Information
    full_name = models.CharField(max_length=200)
    license_number = models.CharField(max_length=100)
    contact_email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    profile_picture = models.ImageField(upload_to='psychartist_profiles/', blank=True, null=True)
    
    # Professional Information
    specialization = models.CharField(max_length=200)
    years_of_experience = models.IntegerField()
    education = models.TextField()
    certifications = models.TextField(blank=True)
    approach = models.CharField(max_length=200)
    languages = models.CharField(max_length=200, blank=True)
    
    # Practice Information
    available_hours = models.CharField(max_length=200, blank=True)
    session_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    bio = models.TextField()
    
    # Application Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_applications')
    review_notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.full_name} - {self.status}"
    
    class Meta:
        ordering = ['-applied_at']


class Psychartist(models.Model):
    # Link to user account
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='psychartist_profile')
    application = models.OneToOneField(PsychartistApplication, on_delete=models.CASCADE, related_name='psychartist_profile')
    
    # Profile Information (copied from approved application)
    full_name = models.CharField(max_length=200)
    license_number = models.CharField(max_length=100)
    contact_email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    profile_picture = models.ImageField(upload_to='psychartist_profiles/', blank=True, null=True)
    specialization = models.CharField(max_length=200)
    years_of_experience = models.IntegerField()
    education = models.TextField()
    certifications = models.TextField(blank=True)
    approach = models.CharField(max_length=200)
    languages = models.CharField(max_length=200, blank=True)
    available_hours = models.CharField(max_length=200, blank=True)
    session_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    bio = models.TextField()
    
    # Profile Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=True)  # Set to True when approved
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Rating and Reviews (for future use)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Dr. {self.full_name}"
    
    class Meta:
        ordering = ['-created_at']