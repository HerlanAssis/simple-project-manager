# Generated by Django 2.1.5 on 2019-06-02 20:06

import apps.core.utils
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
            name='History',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('enable', models.BooleanField(default=True)),
                ('sources', multiselectfield.db.fields.MultiSelectField(choices=[('TELEGRAM', 'Telegram'), ('EMAIL', 'Email')], editable=False, max_length=14)),
                ('message', models.CharField(editable=False, max_length=256)),
                ('created', models.BooleanField(default=False, editable=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Watcher',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('enable', models.BooleanField(default=True)),
                ('notification', multiselectfield.db.fields.MultiSelectField(choices=[('TELEGRAM', 'Telegram'), ('EMAIL', 'Email')], default=['TELEGRAM', 'EMAIL'], max_length=14)),
                ('authorization_code', models.CharField(default=apps.core.utils.create_hash, editable=False, max_length=10, unique=True)),
                ('telegram_chat_id', models.CharField(blank=True, max_length=16)),
                ('observer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='observers', to=settings.AUTH_USER_MODEL)),
                ('vigilant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vigilantes', to='tasks.TaskManager')),
            ],
        ),
        migrations.AddField(
            model_name='history',
            name='watcher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='histories', to='notifications.Watcher'),
        ),
        migrations.AlterUniqueTogether(
            name='watcher',
            unique_together={('vigilant', 'observer')},
        ),
    ]
