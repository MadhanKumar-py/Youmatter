from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.conf import settings
from .serializers import UserRegistrationSerializer, UserProfileSerializer

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
            'user': UserProfileSerializer(user).data,
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
        return Response(UserProfileSerializer(request.user).data)

# TEMPORARY ADMIN CREATION ENDPOINT - REMOVE AFTER USE
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def create_admin_endpoint(request):
    # Only allow this in production and only if admin doesn't exist
    try:
        # Check if admin already exists
        if User.objects.filter(username='admin').exists():
            return Response({
                'error': 'Admin already exists',
                'admin_url': 'https://youmatter-backend-9tfj.onrender.com/admin/',
                'username': 'admin',
                'password': 'YouMatter2024!'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create admin user
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@youmatter.com',
            password='YouMatter2024!'
        )
        
        return Response({
            'success': True,
            'message': 'Admin user created successfully',
            'admin_url': 'https://youmatter-backend-9tfj.onrender.com/admin/',
            'username': 'admin',
            'password': 'YouMatter2024!',
            'note': 'Please remove this endpoint after use for security'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)