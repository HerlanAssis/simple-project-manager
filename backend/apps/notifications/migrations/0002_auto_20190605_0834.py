# Generated by Django 2.1.5 on 2019-06-05 11:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='history',
            options={'ordering': ['created_at', 'updated_at']},
        ),
    ]
