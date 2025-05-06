from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, Revendedor


class RevendedorInline(admin.StackedInline):
    model = Revendedor
    can_delete = False
    verbose_name_plural = "Revendedor Info"


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = [
        "email",
        "username",
        "is_revendedor",
        "is_staff",
        "is_active",
    ]
    inlines = [RevendedorInline]

    def is_revendedor(self, obj):
        return hasattr(obj, "revendedor")

    is_revendedor.boolean = True
    is_revendedor.short_description = "Revendedor"


class RevendedorAdmin(admin.ModelAdmin):
    list_display = ["user", "nome_empresa", "cnpj", "verificado"]
    list_filter = ["verificado"]
    search_fields = ["nome_empresa", "cnpj", "user__email", "user__username"]


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Revendedor, RevendedorAdmin)
