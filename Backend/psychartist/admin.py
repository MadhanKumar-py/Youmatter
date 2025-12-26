from django.contrib import admin
from django.utils import timezone
from .models import PsychartistApplication, Psychartist

@admin.register(PsychartistApplication)
class PsychartistApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'specialization', 'status', 'applied_at']
    list_filter = ['status', 'applied_at', 'specialization']
    search_fields = ['full_name', 'user__username', 'user__email', 'license_number']
    readonly_fields = ['applied_at', 'user']
    ordering = ['-applied_at']
    
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
    
    def save_model(self, request, obj, form, change):
        # If status is being changed to approved, create Psychartist profile
        if change and 'status' in form.changed_data and obj.status == 'approved':
            obj.reviewed_at = timezone.now()
            obj.reviewed_by = request.user
            
            # Create or update Psychartist profile
            psychartist, created = Psychartist.objects.get_or_create(
                user=obj.user,
                defaults={
                    'application': obj,
                    'full_name': obj.full_name,
                    'license_number': obj.license_number,
                    'contact_email': obj.contact_email,
                    'phone_number': obj.phone_number,
                    'profile_picture': obj.profile_picture,
                    'specialization': obj.specialization,
                    'years_of_experience': obj.years_of_experience,
                    'education': obj.education,
                    'certifications': obj.certifications,
                    'approach': obj.approach,
                    'languages': obj.languages,
                    'available_hours': obj.available_hours,
                    'session_rate': obj.session_rate,
                    'bio': obj.bio,
                    'is_active': True,
                    'is_verified': True,
                }
            )
            
            if not created:
                # Update existing profile with latest application data
                psychartist.full_name = obj.full_name
                psychartist.license_number = obj.license_number
                psychartist.contact_email = obj.contact_email
                psychartist.phone_number = obj.phone_number
                psychartist.profile_picture = obj.profile_picture
                psychartist.specialization = obj.specialization
                psychartist.years_of_experience = obj.years_of_experience
                psychartist.education = obj.education
                psychartist.certifications = obj.certifications
                psychartist.approach = obj.approach
                psychartist.languages = obj.languages
                psychartist.available_hours = obj.available_hours
                psychartist.session_rate = obj.session_rate
                psychartist.bio = obj.bio
                psychartist.is_active = True
                psychartist.is_verified = True
                psychartist.save()
        
        elif change and 'status' in form.changed_data and obj.status == 'rejected':
            obj.reviewed_at = timezone.now()
            obj.reviewed_by = request.user
            
            # Deactivate psychartist profile if it exists
            try:
                psychartist = Psychartist.objects.get(user=obj.user)
                psychartist.is_active = False
                psychartist.is_verified = False
                psychartist.save()
            except Psychartist.DoesNotExist:
                pass
        
        super().save_model(request, obj, form, change)

@admin.register(Psychartist)
class PsychartistAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'specialization', 'is_active', 'is_verified', 'average_rating', 'created_at']
    list_filter = ['is_active', 'is_verified', 'specialization', 'created_at']
    search_fields = ['full_name', 'user__username', 'user__email', 'license_number']
    readonly_fields = ['created_at', 'updated_at', 'average_rating', 'total_reviews']
    ordering = ['-created_at']
    
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