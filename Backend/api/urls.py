from django.urls import path, include

# Register your viewsets here
# Example: router.register(r'items', ItemViewSet)

urlpatterns = [
    path('checkin/', include('checkin.urls')),
    path('journal/', include('journal.urls')),
    path('auth/', include('authentication.urls')),
]
