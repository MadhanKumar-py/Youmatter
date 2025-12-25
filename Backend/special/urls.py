from django.urls import path
from . import views

urlpatterns = [
    path('add-comment/', views.add_comment, name='add-comment'),
    path('increment-forgiveness/', views.increment_forgiveness, name='increment-forgiveness'),
    path('get-data/', views.get_friend_data, name='get-friend-data'),
]