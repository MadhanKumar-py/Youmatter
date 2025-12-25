from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from .models import PsychartistApplication, Psychartist
from .serializers import (
    PsychartistApplicationSerializer, 
    PsychartistApplicationAdminSerializer,
    PsychartistSerializer
)

class PsychartistApplicationCreateView(generics.CreateAPIView):
    serializer_class = PsychartistApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        # Check if user already has an application
        if PsychartistApplication.objects.filter(user=request.user).exists():
            return Response(
                {'error': 'You have already submitted a psychartist application.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()
        
        return Response({
            'message': 'Your psychartist application has been submitted successfully!',
            'application_id': application.id,
            'status': application.status
        }, status=status.HTTP_201_CREATED)

class PsychartistApplicationStatusView(generics.RetrieveAPIView):
    serializer_class = PsychartistApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        try:
            return PsychartistApplication.objects.get(user=self.request.user)
        except PsychartistApplication.DoesNotExist:
            return None
    
    def retrieve(self, request, *args, **kwargs):
        application = self.get_object()
        if not application:
            return Response(
                {'message': 'No application found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)

# Admin Views (for superuser only)
class PsychartistApplicationListView(generics.ListAPIView):
    queryset = PsychartistApplication.objects.all()
    serializer_class = PsychartistApplicationAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def approve_psychartist_application(request, application_id):
    try:
        application = PsychartistApplication.objects.get(id=application_id)
    except PsychartistApplication.DoesNotExist:
        return Response(
            {'error': 'Application not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if application.status != 'pending':
        return Response(
            {'error': 'Application has already been reviewed.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Update application status
    application.status = 'approved'
    application.reviewed_at = timezone.now()
    application.reviewed_by = request.user
    application.review_notes = request.data.get('review_notes', '')
    application.save()
    
    # Create Psychartist profile
    psychartist = Psychartist.objects.create(
        user=application.user,
        application=application,
        full_name=application.full_name,
        license_number=application.license_number,
        contact_email=application.contact_email,
        phone_number=application.phone_number,
        profile_picture=application.profile_picture,
        specialization=application.specialization,
        years_of_experience=application.years_of_experience,
        education=application.education,
        certifications=application.certifications,
        approach=application.approach,
        languages=application.languages,
        available_hours=application.available_hours,
        session_rate=application.session_rate,
        bio=application.bio,
        is_verified=True
    )
    
    return Response({
        'message': 'Application approved successfully!',
        'psychartist_id': psychartist.id
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def reject_psychartist_application(request, application_id):
    try:
        application = PsychartistApplication.objects.get(id=application_id)
    except PsychartistApplication.DoesNotExist:
        return Response(
            {'error': 'Application not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if application.status != 'pending':
        return Response(
            {'error': 'Application has already been reviewed.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Update application status
    application.status = 'rejected'
    application.reviewed_at = timezone.now()
    application.reviewed_by = request.user
    application.review_notes = request.data.get('review_notes', '')
    application.save()
    
    return Response({
        'message': 'Application rejected.',
        'review_notes': application.review_notes
    }, status=status.HTTP_200_OK)

# Public Views
class PsychartistListView(generics.ListAPIView):
    queryset = Psychartist.objects.filter(is_active=True, is_verified=True)
    serializer_class = PsychartistSerializer
    permission_classes = [permissions.AllowAny]

class PsychartistDetailView(generics.RetrieveAPIView):
    queryset = Psychartist.objects.filter(is_active=True, is_verified=True)
    serializer_class = PsychartistSerializer
    permission_classes = [permissions.AllowAny]