from django.contrib import admin
from .models import FriendComment, ForgivenessCount

# Completely disable FriendComment admin to avoid 500 error
# @admin.register(FriendComment)
# class FriendCommentAdmin(admin.ModelAdmin):
#     list_display = ['id', 'created_at']
#     readonly_fields = ['created_at']
#     ordering = ['-created_at']

# Disable ForgivenessCount temporarily
# @admin.register(ForgivenessCount)
# class ForgivenessCountAdmin(admin.ModelAdmin):
#     list_display = ['count', 'last_updated']
#     readonly_fields = ['last_updated']