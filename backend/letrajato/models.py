from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
import uuid
from django.utils import timezone

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title


class CustomUser(AbstractUser):

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=25)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    objects = CustomUserManager()
    
    def __str__(self):
        return self.email
        
    @property
    def is_revendedor(self):
        return hasattr(self, 'revendedor')
    
class Revendedor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, related_name='revendedor')
    cnpj = models.CharField(max_length=14)
    nome_empresa = models.CharField(max_length=255)
    verificado = models.BooleanField(default=False)
    verification_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    cnpj_data = models.JSONField(null=True, blank=True)

    
    def __str__(self):
        return f"Revendedor: {self.user.email} - {self.nome_empresa}"
    
    def save(self, *args, **kwargs):
        if not self.verification_token:
            self.verification_token = uuid.uuid4()
        super().save(*args, **kwargs)


class SupportTicket(models.Model):
    STATUS_CHOICES = (
        ('open', 'Aberto'),
        ('in_progress', 'Em andamento'),
        ('closed', 'Fechado'),
    )
    
    title = models.CharField(max_length=200)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='support_tickets')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    def close(self):
        self.status = 'closed'
        self.closed_at = timezone.now()
        self.save()
    
    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

class TicketMessage(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    is_from_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='ticket_attachments/%Y/%m/', null=True, blank=True)
    attachment_name = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"Message from {self.sender.username} on {self.ticket.title}"
    
    def save(self, *args, **kwargs):
        if self.attachment and not self.attachment_name:
            self.attachment_name = self.attachment.name.split('/')[-1]
        super().save(*args, **kwargs)
