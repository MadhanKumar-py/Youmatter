from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import PsychartistApplication, Psychartist

@admin.register(PsychartistApplication)
class PsychartistApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user_email', 'specialization', 'status', 'applied_at')
    list_filter = ('status', 'specialization', 'applied_at')
    search_fields = ('full_name', 'user__email', 'license_number', 'specialization')
    readonly_fields = ('applied_at', 'reviewed_at')
    ordering = ('-applied_at',)
    
    fieldsets = (
        ('Application Info', {
            'fields': ('user', 'status', 'applied_at', 'reviewed_at', 'reviewed_by', 'review_notes')
        }),
        ('Personal Information', {
            'fields': ('full_name', 'license_number', 'contact_email', 'phone_number', 'profile_picture')
        }),
        ('Professional Information', {
            'fields': ('specialization', 'years_of_experience', 'education', 'certifications', 'approach', 'languages')
        }),
        ('Practice Information', {
            'fields': ('available_hours', 'session_rate', 'bio')
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    
    def save_model(self, request, obj, form, change):
        if change and obj.status == 'approved' and not hasattr(obj, 'psychartist_profile'):
            # Auto-create psychartist profile when approved
            from .models import Psychartist
            Psychartist.objects.create(
                user=obj.user,
                application=obj,
                full_name=obj.full_name,
                license_number=obj.license_number,
                contact_email=obj.contact_email,
                phone_number=obj.phone_number,
                profile_picture=obj.profile_picture,
                specialization=obj.specialization,
                years_of_experience=obj.years_of_experience,
                education=obj.education,
                certifications=obj.certifications,
                approach=obj.approach,
                languages=obj.languages,
                available_hours=obj.available_hours,
                session_rate=obj.session_rate,
                bio=obj.bio,
                is_verified=True
            )
            obj.reviewed_by = request.user
            obj.reviewed_at = timezone.now()
        
        super().save_model(request, obj, form, change)

@admin.register(Psychartist)
class PsychartistAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user_email', 'specialization', 'is_active', 'is_verified', 'average_rating', 'created_at')
    list_filter = ('is_active', 'is_verified', 'specialization', 'created_at')
    search_fields = ('full_name', 'user__email', 'license_number', 'specialization')
    readonly_fields = ('created_at', 'updated_at', 'average_rating', 'total_reviews')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Profile Info', {
            'fields': ('user', 'application', 'is_active', 'is_verified', 'created_at', 'updated_at')
        }),
        ('Personal Information', {
            'fields': ('full_name', 'license_number', 'contact_email', 'phone_number', 'profile_picture')
        }),
        ('Professional Information', {
            'fields': ('specialization', 'years_of_experience', 'education', 'certifications', 'approach', 'languages')
        }),
        ('Practice Information', {
            'fields': ('available_hours', 'session_rate', 'bio')
        }),
        ('Rating & Reviews', {
            'fields': ('average_rating', 'total_reviews')
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'