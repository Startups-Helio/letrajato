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
    message = models.TextField(blank=True)  # Allow blank
    is_from_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.sender.username} on {self.ticket.title}"

class TicketAttachment(models.Model):
    message = models.ForeignKey(TicketMessage, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='ticket_attachments/%Y/%m/')
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Attachment: {self.filename}"
    
    def save(self, *args, **kwargs):
        if not self.filename and self.file:
            self.filename = self.file.name.split('/')[-1]
        super().save(*args, **kwargs)


class Product(models.Model):
    CATEGORY_CHOICES = (
        ('printer', 'Impressora 3D'),
        ('filament', 'Filamento'),
        ('accessory', 'Acessório'),
        ('part', 'Peça de Reposição'),
    )
    
    STATUS_CHOICES = (
        ('available', 'Disponível'),
        ('out_of_stock', 'Fora de Estoque'),
        ('discontinued', 'Descontinuado'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='printer')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # 3D Printer specific fields
    build_volume = models.CharField(max_length=100, blank=True, null=True)  # e.g., "220x220x250mm"
    layer_resolution = models.CharField(max_length=50, blank=True, null=True)  # e.g., "0.1-0.3mm"
    print_speed = models.CharField(max_length=50, blank=True, null=True)  # e.g., "150mm/s"
    nozzle_diameter = models.CharField(max_length=20, blank=True, null=True)  # e.g., "0.4mm"
    filament_diameter = models.CharField(max_length=20, blank=True, null=True)  # e.g., "1.75mm"
    supported_materials = models.TextField(blank=True, null=True)  # e.g., "PLA, ABS, PETG"
    connectivity = models.CharField(max_length=100, blank=True, null=True)  # e.g., "USB, WiFi, SD Card"
    
    # General product fields
    brand = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)
    weight = models.CharField(max_length=50, blank=True, null=True)  # e.g., "7.5kg"
    dimensions = models.CharField(max_length=100, blank=True, null=True)  # e.g., "440x410x465mm"
    warranty_period = models.CharField(max_length=50, blank=True, null=True)  # e.g., "12 months"
    
    # Images and media
    image_url = models.URLField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='products')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.brand} {self.model}"
    
    @property
    def is_available(self):
        return self.status == 'available' and self.quantity > 0
