from django.contrib import admin
from .models import JournalEntry

# Temporarily comment out admin registration to fix 500 error
# @admin.register(JournalEntry)
# class JournalEntryAdmin(admin.ModelAdmin):
#     list_display = ('title', 'user', 'created_at', 'updated_at')
#     search_fields = ('title', 'content', 'user__username', 'user__email')
#     list_filter = ('created_at', 'user')
#     readonly_fields = ('created_at', 'updated_at')
#     ordering = ('-created_at',)
    
#     fieldsets = (
#         ('Entry Info', {
#             'fields': ('user', 'title', 'created_at', 'updated_at')
#         }),
#         ('Content', {
#             'fields': ('content',)
#         }),
#     )
