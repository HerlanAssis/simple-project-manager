from django.contrib import admin
from .models import TaskManager, Task, Note

admin.site.register(TaskManager)
admin.site.register(Task)
admin.site.register(Note)