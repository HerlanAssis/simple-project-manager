# Generated by Django 2.1.5 on 2019-05-22 22:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasks', '0007_auto_20190522_1123'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='release',
            name='date_end',
        ),
        migrations.RemoveField(
            model_name='release',
            name='date_start',
        ),
        migrations.RemoveField(
            model_name='taskmanager',
            name='url',
        ),
        migrations.AddField(
            model_name='note',
            name='task_manager',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='taskmanager_notes', to='tasks.TaskManager'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='release',
            name='completed_on',
            field=models.DateField(default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='task',
            name='owner',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='task',
            name='responsible',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='responsibilities_tasks', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='taskmanager',
            name='project_id',
            field=models.CharField(editable=False, max_length=256, unique=True),
        ),
    ]
