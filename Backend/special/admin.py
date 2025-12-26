from django.contrib import admin
from .models import FriendComment, ForgivenessCount

# Simplified FriendComment admin to identify 500 error
@admin.register(FriendComment)
class FriendCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

# Disable ForgivenessCount temporarily
# @admin.register(ForgivenessCount)
# class ForgivenessCountAdmin(admin.ModelAdmin):
#     list_display = ['count', 'last_updated']
#     readonly_fields = ['last_updated']
    
#     def has_add_permission(self, request):
#         # Only allow one forgiveness count record
#         return not ForgivenessCount.objects.exists()
    
#     def has_delete_permission(self, request, obj=None):
#         # Don't allow deletion of the forgiveness count
#         return False