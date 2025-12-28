from django.contrib import admin
from .models import CheckIn, QuickCheckIn

# Enable one by one to identify 500 error source
@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ('user', 'mood', 'reason', 'created_at')
    list_filter = ('created_at', 'mood')
    search_fields = ('user__username', 'user__email', 'reason', 'notes')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        """Filter check-ins based on user permissions"""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs  # Superuser can see all entries
        return qs.filter(user=request.user)  # Regular users see only their entries
    
    def has_change_permission(self, request, obj=None):
        """Only allow users to edit their own check-ins"""
        if obj is None:
            return True
        if request.user.is_superuser:
            return True
        return obj.user == request.user
    
    def has_delete_permission(self, request, obj=None):
        """Only allow users to delete their own check-ins"""
        if obj is None:
            return True
        if request.user.is_superuser:
            return True
        return obj.user == request.user

@admin.register(QuickCheckIn)
class QuickCheckInAdmin(admin.ModelAdmin):
    list_display = ('user', 'mood', 'intensity', 'type', 'created_at')
    list_filter = ('created_at', 'type', 'intensity')
    search_fields = ('user__username', 'user__email', 'note')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        """Filter quick check-ins based on user permissions"""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs  # Superuser can see all entries
        return qs.filter(user=request.user)  # Regular users see only their entries
    
    def has_change_permission(self, request, obj=None):
        """Only allow users to edit their own quick check-ins"""
        if obj is None:
            return True
        if request.user.is_superuser:
            return True
        return obj.user == request.user
    
    def has_delete_permission(self, request, obj=None):
        """Only allow users to delete their own quick check-ins"""
        if obj is None:
            return True
        if request.user.is_superuser:
            return True
        return obj.user == request.user
