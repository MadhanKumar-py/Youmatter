from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    psychartist_status = serializers.SerializerMethodField()
    psychartist_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'date_joined', 'psychartist_status', 'psychartist_profile')
        read_only_fields = ('id', 'email', 'date_joined')
    
    def get_psychartist_status(self, obj):
        """Get psychartist application status"""
        try:
            application = obj.psychartist_application
            return {
                'has_application': True,
                'status': application.status,
                'applied_at': application.applied_at
            }
        except:
            return {
                'has_application': False,
                'status': None,
                'applied_at': None
            }
    
    def get_psychartist_profile(self, obj):
        """Get psychartist profile if approved"""
        try:
            profile = obj.psychartist_profile
            return {
                'id': profile.id,
                'full_name': profile.full_name,
                'specialization': profile.specialization,
                'years_of_experience': profile.years_of_experience,
                'profile_picture': profile.profile_picture.url if profile.profile_picture else None,
                'is_active': profile.is_active,
                'average_rating': float(profile.average_rating),
                'total_reviews': profile.total_reviews
            }
        except:
            return None