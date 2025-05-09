# Generated by Django 5.2 on 2025-05-05 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('letrajato', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='verificado',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='customuser',
            name='verification_token',
            field=models.UUIDField(blank=True, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.CharField(max_length=150),
        ),
    ]
