from django.contrib import admin
from .models import PsychartistApplication, Psychartist

# Enable one by one to identify 500 error source
admin.site.register(PsychartistApplication)
admin.site.register(Psychartist)