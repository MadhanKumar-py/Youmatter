from django.contrib import admin
from .models import FriendComment, ForgivenessCount

# Completely remove FriendComment from admin to stop 500 errors
# admin.site.register(FriendComment)

# Disable ForgivenessCount temporarily
# @admin.register(ForgivenessCount)
# class ForgivenessCountAdmin(admin.ModelAdmin):
#     list_display = ['count', 'last_updated']
#     readonly_fields = ['last_updated']