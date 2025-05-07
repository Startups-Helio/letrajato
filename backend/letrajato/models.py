from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
import uuid

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title


class CustomUser(AbstractUser):

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150)
    
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
    
    def __str__(self):
        return f"Revendedor: {self.user.email} - {self.nome_empresa}"
    
    def save(self, *args, **kwargs):
        if not self.verification_token:
            self.verification_token = uuid.uuid4()
        super().save(*args, **kwargs)
