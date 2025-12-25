from django.db import models
from django.conf import settings


class CheckIn(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='checkins')
    mood = models.CharField(max_length=255)
    reason = models.CharField(max_length=500)
    notes = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood} - {self.reason}"



class QuickCheckIn(models.Model):
    MOOD_MAX = 16
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quick_checkins')
    mood = models.CharField(max_length=MOOD_MAX)   # store emoji or short label
    intensity = models.IntegerField(null=True, blank=True)
    note = models.CharField(max_length=500, blank=True)
    type = models.CharField(max_length=20, default="full")  # "full" or "quick"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood} ({self.created_at})"
