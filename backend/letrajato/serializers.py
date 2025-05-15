from django.contrib.auth.models import User
from .models import CustomUser, Revendedor, TicketAttachment
from rest_framework import serializers
from .models import Note, SupportTicket, TicketMessage

class RevendedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Revendedor
        fields = ['cnpj', 'nome_empresa', 'verificado']
        read_only_fields = ['verificado']

class UserSerializer(serializers.ModelSerializer):
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

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )

        Revendedor.objects.create(
            user=user,
            cnpj=cnpj,
            nome_empresa=nome_empresa,
            verificado=False,
            cnpj_data=consulta_data 
        )

        if consulta_data:
            self.context['consulta_data'] = consulta_data

        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if hasattr(instance, 'revendedor'):
            data['is_revendedor'] = True
            data['verificado'] = instance.revendedor.verificado
            data['cnpj'] = instance.revendedor.cnpj
            data['nome_empresa'] = instance.revendedor.nome_empresa
            data['cnpj_data'] = instance.revendedor.cnpj_data
        else:
            data['is_revendedor'] = False
            data['verificado'] = True
        
        return data

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}

class TicketAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAttachment
        fields = ['id', 'file', 'filename', 'uploaded_at']

class TicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = TicketMessage
        fields = ['id', 'ticket', 'sender', 'sender_name', 'message', 'is_from_admin', 'created_at', 'attachments']
        read_only_fields = ['created_at']
    
    def get_sender_name(self, obj):
        return obj.sender.username

    def validate(self, data):
        # Allow empty message if files are being uploaded
        has_files = 'uploaded_files' in self.initial_data and self.initial_data.getlist('uploaded_files')
        if not data.get('message') and not has_files:
            raise serializers.ValidationError({"message": "Either message or files must be provided."})
        return data

    def validate_uploaded_files(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("You can only upload up to 5 files per message.")
        return value
        
    def create(self, validated_data):
        uploaded_files = validated_data.pop('uploaded_files', [])
        message = TicketMessage.objects.create(**validated_data)
        
        for file in uploaded_files:
            TicketAttachment.objects.create(message=message, file=file, filename=file.name)
            
        return message

class SupportTicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    status_display = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'title', 'status', 'status_display',
                  'created_at', 'updated_at', 'closed_at', 'messages', 'username']
        
    def get_status_display(self, obj):
        return obj.get_status_display()
    
    def get_username(self, obj):
        return obj.user.username if obj.user else "Unknown"
