from django.contrib.auth.models import User
from .models import CustomUser, Revendedor
from rest_framework import serializers
from .models import Note

class RevendedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Revendedor
        fields = ['cnpj', 'nome_empresa', 'verificado']
        read_only_fields = ['verificado']

class UserSerializer(serializers.ModelSerializer):
    # These fields are now write-only fields just for registration
    cnpj = serializers.CharField(write_only=True, required=True)
    nome_empresa = serializers.CharField(write_only=True, required=True)
    consulta_data = serializers.JSONField(write_only=True, required=False)
    is_revendedor = serializers.BooleanField(read_only=True, source='revendedor', required=False)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "username", "password", "cnpj", "nome_empresa", "consulta_data", "is_revendedor"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "username": {"required": True},
        }

    def create(self, validated_data):
        consulta_data = validated_data.pop('consulta_data', None)
        cnpj = validated_data.pop('cnpj')
        nome_empresa = validated_data.pop('nome_empresa')

        # Create base user
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )

        # Create revendedor record for the user
        Revendedor.objects.create(
            user=user,
            cnpj=cnpj,
            nome_empresa=nome_empresa,
            verificado=False  # Start unverified
        )

        # Store for email sending
        if consulta_data:
            self.context['consulta_data'] = consulta_data

        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Add revendedor status if available
        if hasattr(instance, 'revendedor'):
            data['is_revendedor'] = True
            data['verificado'] = instance.revendedor.verificado
            data['cnpj'] = instance.revendedor.cnpj
            data['nome_empresa'] = instance.revendedor.nome_empresa
        else:
            data['is_revendedor'] = False
            data['verificado'] = True  # Normal users don't need verification
        
        return data

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
