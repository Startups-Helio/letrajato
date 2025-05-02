from django.contrib.auth.models import User
from .models import CustomUser
from rest_framework import serializers
from .models import Note


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "username", "password", "cnpj", "nome_empresa", "consulta_data"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "username": {"required": True},
            "cnpj": {"required": True},
            "nome_empresa": {"required": True}
        }

    def create(self, validated_data):
        consulta_data = validated_data.pop('consulta_data', None)

        user = CustomUser.objects.create_user(**validated_data)

        self.context['consulta_data'] = consulta_data
        
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
