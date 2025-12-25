from django.contrib import admin
from .models import PsychartistApplication, Psychartist

# Keep only basic admin registration to avoid 500 errors
admin.site.register(PsychartistApplication)
admin.site.register(Psychartist)