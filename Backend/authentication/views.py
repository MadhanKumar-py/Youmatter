from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.conf import settings
from .serializers import UserRegistrationSerializer, UserSerializer
from psychartist.models import PsychartistProfile
from psychartist.serializers import PsychartistProfileSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get psychartist profile if exists
        psychartist_profile = None
        psychartist_status = {
            'has_application': False,
            'status': None,
            'applied_at': None
        }
        
        try:
            psychartist_profile = PsychartistProfile.objects.get(user=request.user)
            if psychartist_profile.is_approved:
                # User is an approved psychartist
                pass
            else:
                # User has application but not approved
                psychartist_status = {
                    'has_application': True,
                    'status': 'pending' if not psychartist_profile.is_rejected else 'rejected',
                    'applied_at': psychartist_profile.created_at.isoformat()
                }
                psychartist_profile = None  # Don't include profile data if not approved
        except PsychartistProfile.DoesNotExist:
            pass
        
        user_data = UserSerializer(request.user).data
        user_data['psychartist_status'] = psychartist_status
        
        if psychartist_profile:
            user_data['psychartist_profile'] = PsychartistProfileSerializer(psychartist_profile).data
        
        return Response(user_data)

# TEMPORARY ADMIN CREATION ENDPOINT - REMOVE AFTER USE
@api_view(['POST'])
@permission_classes([AllowAny])
def create_admin_endpoint(request):
    # Only allow this in production and only if admin doesn't exist
    if not settings.DEBUG:  # Only in production
        try:
            # Check if admin already exists
            if User.objects.filter(username='admin').exists():
                return Response({'error': 'Admin already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create admin user
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@youmatter.com',
                password='YouMatter2024!'
            )
            
            return Response({
                'success': True,
                'message': 'Admin user created successfully',
                'username': 'admin',
                'note': 'Please remove this endpoint after use for security'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': 'This endpoint only works in production'}, status=status.HTTP_403_FORBIDDEN)