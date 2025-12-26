from django.contrib import admin
from .models import JournalEntry

@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'updated_at')
    search_fields = ('title', 'content', 'user__username', 'user__email')
    list_filter = ('created_at', 'user')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        """Filter journal entries based on user permissions"""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs  # Superuser can see all entries
        return qs.filter(user=request.user)  # Regular users see only their entries
    
    def has_change_permission(self, request, obj=None):
        """Only allow users to edit their own journal entries"""
        if obj is None:
            return True
        if request.user.is_superuser:
            return True
        return obj.user == request.user
    
    def has_delete_permission(self, request, obj=None):
        """Only allow users to delete their own journal entries"""
        if obj is None:
            return True
        if request.user.is_superuser:
            return True
        return obj.user == request.user
