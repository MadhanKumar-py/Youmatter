from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('apply/', views.PsychartistApplicationCreateView.as_view(), name='psychartist-apply'),
    path('application/status/', views.PsychartistApplicationStatusView.as_view(), name='application-status'),
    
    # Admin endpoints
    path('admin/applications/', views.PsychartistApplicationListView.as_view(), name='admin-applications'),
    path('admin/applications/<int:application_id>/approve/', views.approve_psychartist_application, name='approve-application'),
    path('admin/applications/<int:application_id>/reject/', views.reject_psychartist_application, name='reject-application'),
    
    # Public endpoints
    path('', views.PsychartistListView.as_view(), name='psychartist-list'),
    path('<int:pk>/', views.PsychartistDetailView.as_view(), name='psychartist-detail'),
]