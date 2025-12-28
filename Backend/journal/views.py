from rest_framework import generics
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from rest_framework.permissions import IsAuthenticated

class JournalEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return journal entries for the authenticated user
        return JournalEntry.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Set the user when creating a new journal entry
        serializer.save(user=self.request.user)

class JournalEntryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JournalEntrySerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only allow access to user's own journal entries
        return JournalEntry.objects.filter(user=self.request.user)
