from django.urls import path
from . import views

urlpatterns = [
    path('', views.CheckInListCreateView.as_view(), name='checkin-list-create'),
    path('<int:id>/', views.CheckInRetrieveUpdateDestroyView.as_view(), name='checkin-detail'),
    path('quick/', views.QuickCheckInListCreateView.as_view(), name='quick-checkin-list-create'),
    path('quick/<int:id>/', views.QuickCheckInRetrieveUpdateDestroyView.as_view(), name='quick-checkin-detail'),
]