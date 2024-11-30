# Generated by Django 5.1.2 on 2024-11-30 15:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_eventimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventimage',
            name='event',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.event'),
        ),
    ]
