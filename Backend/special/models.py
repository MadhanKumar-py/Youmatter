from django.db import models
from django.utils import timezone


class FriendComment(models.Model):
    text = models.TextField()
    timestamp = models.DateTimeField(null=True, blank=True)  # Allow null to avoid default issues
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment: {self.text[:50]}..." if len(self.text) > 50 else f"Comment: {self.text}"


class ForgivenessCount(models.Model):
    count = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)  # Use auto_now instead of default
    
    class Meta:
        verbose_name = "Forgiveness Count"
        verbose_name_plural = "Forgiveness Counts"
    
    def __str__(self):
        return f"Forgiveness Count: {self.count}"
    
    @classmethod
    def get_current_count(cls):
        """Get or create the forgiveness count record"""
        obj, created = cls.objects.get_or_create(
            id=1,  # Always use ID 1 to ensure single record
            defaults={'count': 0}
        )
        return obj
    
    @classmethod
    def increment_count(cls):
        """Increment the forgiveness count"""
        obj = cls.get_current_count()
        obj.count += 1
        obj.save()  # auto_now will handle last_updated
        return obj