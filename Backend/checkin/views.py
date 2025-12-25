from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CheckIn, QuickCheckIn
from .serializers import CheckInSerializer, QuickCheckInSerializer


class CheckInListCreateView(generics.ListCreateAPIView):
    serializer_class = CheckInSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CheckIn.objects.filter(user=self.request.user).order_by('-id')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CheckInRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CheckInSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CheckIn.objects.filter(user=self.request.user)


class QuickCheckInListCreateView(generics.ListCreateAPIView):
    serializer_class = QuickCheckInSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return QuickCheckIn.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuickCheckInRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuickCheckInSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return QuickCheckIn.objects.filter(user=self.request.user)
