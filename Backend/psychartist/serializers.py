from rest_framework import serializers
from .models import PsychartistApplication, Psychartist

class PsychartistApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PsychartistApplication
        fields = [
            'id', 'full_name', 'license_number', 'contact_email', 'phone_number',
            'profile_picture', 'specialization', 'years_of_experience', 'education', 
            'certifications', 'approach', 'languages', 'available_hours', 'session_rate', 
            'bio', 'status', 'applied_at', 'reviewed_at', 'review_notes'
        ]
        read_only_fields = ['id', 'status', 'applied_at', 'reviewed_at', 'review_notes']
    
    def create(self, validated_data):
        # Set the user from the request context
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class PsychartistApplicationAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = PsychartistApplication
        fields = [
            'id', 'user_email', 'user_username', 'full_name', 'license_number', 
            'contact_email', 'phone_number', 'profile_picture', 'specialization', 
            'years_of_experience', 'education', 'certifications', 'approach', 'languages', 
            'available_hours', 'session_rate', 'bio', 'status', 'applied_at', 
            'reviewed_at', 'review_notes'
        ]
        read_only_fields = ['id', 'user_email', 'user_username', 'applied_at']

class PsychartistSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Psychartist
        fields = [
            'id', 'user_username', 'full_name', 'license_number', 'contact_email',
            'phone_number', 'profile_picture', 'specialization', 'years_of_experience', 
            'education', 'certifications', 'approach', 'languages', 'available_hours',
            'session_rate', 'bio', 'is_active', 'is_verified', 'average_rating',
            'total_reviews', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user_username', 'is_verified', 'average_rating', 'total_reviews',
            'created_at', 'updated_at'
        ]