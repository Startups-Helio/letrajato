from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, Revendedor, Note


class RevendedorInline(admin.StackedInline):
    model = Revendedor
    can_delete = True
    verbose_name_plural = "Revendedor Info"
    fieldsets = (
        (None, {'fields': ('cnpj', 'nome_empresa', 'verificado')}),  # Remove verification_token
    )


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    inlines = [RevendedorInline]
    
    # Complete list display
    list_display = [
        "id", "email", "username", "is_revendedor", "is_active",
        "is_staff", "is_superuser", "date_joined", "last_login"
    ]
    
    # Fix the list_filter - remove the reference to RevendedorInline.model.verificado
    list_filter = ("is_staff", "is_active")  # Remove the reference to verificado
    search_fields = ("email", "username")
    ordering = ("-date_joined",)
    
    # Detailed fieldsets - include all standard user fields
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    
    # Fields for creation form
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "username", "password1", "password2"),
            },
        ),
    )

    def is_revendedor(self, obj):
        return hasattr(obj, "revendedor")

    is_revendedor.boolean = True
    is_revendedor.short_description = "Revendedor"


class RevendedorAdmin(admin.ModelAdmin):
    list_display = ["user", "nome_empresa", "cnpj", "verificado"]
    list_filter = ["verificado"]
    search_fields = ["nome_empresa", "cnpj", "user__email", "user__username"]
    
    readonly_fields = ['display_cnpj_data']
    
    def display_cnpj_data(self, obj):
        """Display key CNPJ data in the admin"""
        if not obj.cnpj_data:
            return "No CNPJ data available"
        
        html = "<table style='border-collapse: collapse; width: 100%;'>"
        html += "<tr><th style='border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>Campo</th><th style='border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>Valor</th></tr>"
        
        important_fields = [
            'nome', 'cnpj', 'abertura', 'situacao', 'tipo', 'uf', 
            'municipio', 'bairro', 'logradouro', 'numero', 
            'telefone', 'email', 'capital_social'
        ]
        
        for field in important_fields:
            if field in obj.cnpj_data:
                html += f"<tr><td style='border: 1px solid #ddd; padding: 8px;'><strong>{field}</strong></td><td style='border: 1px solid #ddd; padding: 8px;'>{obj.cnpj_data[field]}</td></tr>"
        
        # Add atividades principais
        if 'atividade_principal' in obj.cnpj_data and obj.cnpj_data['atividade_principal']:
            html += "<tr><td style='border: 1px solid #ddd; padding: 8px;'><strong>atividade_principal</strong></td><td style='border: 1px solid #ddd; padding: 8px;'><ul>"
            for atividade in obj.cnpj_data['atividade_principal']:
                html += f"<li>{atividade.get('text', '')}</li>"
            html += "</ul></td></tr>"
            
        html += "</table>"
        return mark_safe(html)
    
    display_cnpj_data.short_description = "CNPJ Data"


class NoteAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "created_at"]
    search_fields = ["title", "content", "author__email"]
    list_filter = ["created_at"]


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Revendedor, RevendedorAdmin)
admin.site.register(Note, NoteAdmin)
