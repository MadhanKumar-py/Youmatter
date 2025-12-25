from rest_framework import serializers
from .models import JournalEntry

class JournalEntrySerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y %b %d, %I:%M %p", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y %b %d, %I:%M %p", read_only=True)
    
    class Meta:
        model = JournalEntry
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
