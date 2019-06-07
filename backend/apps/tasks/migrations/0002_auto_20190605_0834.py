# Generated by Django 2.1.5 on 2019-06-05 11:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='note',
            options={'ordering': ['created_at', 'updated_at']},
        ),
        migrations.AlterModelOptions(
            name='release',
            options={'ordering': ['created_at', 'updated_at']},
        ),
        migrations.AlterModelOptions(
            name='task',
            options={'ordering': ['created_at', 'updated_at']},
        ),
        migrations.AlterField(
            model_name='task',
            name='description',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]
