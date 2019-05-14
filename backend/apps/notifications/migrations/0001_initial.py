# Generated by Django 2.1.5 on 2019-05-14 21:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import multiselectfield.db.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Watcher',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('notification', multiselectfield.db.fields.MultiSelectField(choices=[('TELEGRAM', 'Telegram'), ('EMAIL', 'Email')], max_length=14)),
                ('observer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='observers', to=settings.AUTH_USER_MODEL)),
                ('watcher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='observed_tasks', to='tasks.TaskManager')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
