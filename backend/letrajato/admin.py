from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = [
        "email",
        "username",
        "cnpj",
        "nome_empresa",
        "verificado",
        "verification_token",
        "is_staff",
        "is_active",
    ]


admin.site.register(CustomUser, CustomUserAdmin)
