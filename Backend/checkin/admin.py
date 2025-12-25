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
