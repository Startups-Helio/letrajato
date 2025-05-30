# Generated by Django 5.2 on 2025-05-15 00:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('letrajato', '0010_ticketmessage_attachment_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ticketmessage',
            name='attachment',
        ),
        migrations.RemoveField(
            model_name='ticketmessage',
            name='attachment_name',
        ),
        migrations.CreateModel(
            name='TicketAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='ticket_attachments/%Y/%m/')),
                ('filename', models.CharField(max_length=255)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='letrajato.ticketmessage')),
            ],
        ),
    ]
