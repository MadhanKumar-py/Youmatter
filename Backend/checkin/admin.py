from django.contrib import admin
from .models import CheckIn, QuickCheckIn

@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ('user', 'mood', 'reason', 'created_at')
    list_filter = ('created_at', 'mood')
    search_fields = ('user__username', 'user__email', 'reason', 'notes')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Check-in Info', {
            'fields': ('user', 'mood', 'reason', 'color', 'created_at')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )

@admin.register(QuickCheckIn)
class QuickCheckInAdmin(admin.ModelAdmin):
    list_display = ('user', 'mood', 'intensity', 'type', 'created_at')
    list_filter = ('created_at', 'type', 'intensity')
    search_fields = ('user__username', 'user__email', 'note')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Quick Check-in Info', {
            'fields': ('user', 'mood', 'intensity', 'type', 'created_at')
        }),
        ('Note', {
            'fields': ('note',)
        }),
    )
