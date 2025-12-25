from rest_framework import generics
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from rest_framework.permissions import AllowAny

class JournalEntryListCreateView(generics.ListCreateAPIView):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [AllowAny]

class JournalEntryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    lookup_field = "id"
    permission_classes = [AllowAny]
