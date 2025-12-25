from django.urls import path
from . import views

urlpatterns = [
    path('', views.JournalEntryListCreateView.as_view(), name='journal-list-create'),
    path('<int:id>/', views.JournalEntryRetrieveUpdateDestroyView.as_view(), name='journal-detail'),
]
