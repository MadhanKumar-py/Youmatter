from django.contrib import admin
from .models import FriendComment, ForgivenessCount

# Temporarily comment out admin registrations to fix 500 error
# @admin.register(FriendComment)
# class FriendCommentAdmin(admin.ModelAdmin):
#     list_display = ['id', 'text_preview', 'timestamp', 'created_at']
#     list_filter = ['created_at', 'timestamp']
#     search_fields = ['text']
#     readonly_fields = ['created_at']
#     ordering = ['-created_at']
    
#     def text_preview(self, obj):
#         return obj.text[:100] + "..." if len(obj.text) > 100 else obj.text
#     text_preview.short_description = 'Comment Preview'

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