# Generated by Django 2.1.5 on 2019-06-05 11:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_auto_20190605_0834'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='note',
            options={'ordering': ['-created_at', '-updated_at']},
        ),
        migrations.AlterModelOptions(
            name='release',
            options={'ordering': ['-created_at', '-updated_at']},
        ),
        migrations.AlterModelOptions(
            name='task',
            options={'ordering': ['-created_at', '-updated_at']},
        ),
    ]
