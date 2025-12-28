from rest_framework import serializers
from .models import JournalEntry

class JournalEntrySerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y %b %d, %I:%M %p", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y %b %d, %I:%M %p", read_only=True)
    user = serializers.StringRelatedField(read_only=True)  # Show username instead of ID
    
    class Meta:
        model = JournalEntry
        fields = ['id', 'user', 'title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
