from django.contrib import admin
from .models import FriendComment, ForgivenessCount

# Very basic admin registration to test
admin.site.register(FriendComment)

# Disable ForgivenessCount temporarily
# @admin.register(ForgivenessCount)
# class ForgivenessCountAdmin(admin.ModelAdmin):
#     list_display = ['count', 'last_updated']
#     readonly_fields = ['last_updated']