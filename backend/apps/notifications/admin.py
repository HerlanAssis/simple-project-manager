from django.contrib import admin
from .models import Watcher, NotificationHistory

admin.site.register(Watcher)
admin.site.register(NotificationHistory)