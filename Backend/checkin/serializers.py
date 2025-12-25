from rest_framework import serializers
from .models import CheckIn, QuickCheckIn

class CheckInSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(
        format="%Y %b %d, %I:%M %p",
        read_only=True
    )

    class Meta:
        model = CheckIn
        fields = "__all__"
        read_only_fields = ['user', 'created_at']

class QuickCheckInSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(
        format="%Y %b %d, %I:%M %p",
        read_only=True
    )
    
    class Meta:
        model = QuickCheckIn
        fields = ['id', 'user', 'mood', 'intensity', 'note', 'type', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']