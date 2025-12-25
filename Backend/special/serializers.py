from rest_framework import serializers
from .models import FriendComment, ForgivenessCount


class FriendCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendComment
        fields = ['id', 'text', 'timestamp', 'created_at']
        read_only_fields = ['id', 'created_at']


class ForgivenessCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForgivenessCount
        fields = ['count', 'last_updated']
        read_only_fields = ['count', 'last_updated']