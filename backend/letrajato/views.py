from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from django.core.mail import EmailMultiAlternatives
import requests
from django.conf import settings
import threading

from .models import CustomUser
# Create your views here.


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def perform_create(self, serializer):

        user = serializer.save()

        consulta_data = serializer.context.get('consulta_data', {})
        
        threading.Thread(
            target=self._send_welcome_email,
            args=(user.email, user.username, user.nome_empresa, user.cnpj, consulta_data)
        ).start()
    
    def _send_welcome_email(self, email, username, empresa, cnpj, consulta_data):
        try:
            cliente_subject = "Bem-vindo à Letrajato"
            cliente_plain_message = f"Bem-vindo à Letrajato, {username}! Seu registro foi efetuado com sucesso."

            admin_subject = "Nova solicitação de cadastro"
            admin_plain_message = f"Uma nova solicitação de cadastro foi realizada por {username} para a empresa {empresa}. O CNPJ fornecido é {cnpj}."
            
            cnpj_found = consulta_data and not consulta_data.get('error') and consulta_data.get('nome')

            cliente_html_message = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #FF5207;">Bem-vindo à Letrajato!</h2>
                            <p>Olá <strong>{username}</strong>,</p>
                            <p>Agradecemos por se cadastrar em nosso sistema! Sua conta para <strong>{empresa}</strong> foi criada com sucesso.</p>
                            <p>Você já pode fazer login utilizando as informações cadastradas.</p>
                            <p>Enviamos sua solicitação para análise e em breve traremos notícias.</p>
                            <p>Esperamos trabalhar com você em breve!</p>
                            <p>Atenciosamente,<br>Equipe Letrajato</p>
                        </div>
                    </body>
                </html>
                """
            
            if cnpj_found:
                atv_principais = consulta_data.get('atividade_principal', [])
                atividade_principal = atv_principais[0]['text'] if atv_principais else 'N/A'

                atc_secundarias = consulta_data.get('atividades_secundarias', [])
                sec = ""
                for atc in atc_secundarias:
                    sec += f"<li><strong>{atc['text']}</strong></li>"
                
                admin_html_message = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #FF5207;">Uma nova solicitação de cadastro foi realizada!</h2>
                            <p>Olá <strong>Otávio</strong>,</p>
                            <p>Um novo revendedor solicitou registro no sistema. A solicitação foi realizada pelo usuário {username}</p>
                            <p>para a empresa com nome {empresa}. Sua conta foi criada com sucesso e aguarda verificação.</p>
                            <p>Dados da empresa:</p>
                            <ul>
                                <li><strong>CNPJ:</strong> {consulta_data.get('cnpj', 'N/A')}</li>
                                <li><strong>Nome Registrado:</strong> {consulta_data.get('nome', 'N/A')}</li>
                                <li><strong>Data de abertura:</strong> {consulta_data.get('abertura', 'N/A')}</li>
                                <li><strong>Situação:</strong> {consulta_data.get('situacao', 'N/A')}</li>
                                <li><strong>UF:</strong> {consulta_data.get('uf', 'N/A')}</li>
                                <li><strong>Municipio:</strong> {consulta_data.get('municipio', 'N/A')}</li>
                                <li><strong>Atividade Principal:</strong> {atividade_principal}</li>
                                <li><strong>Atividades Secundárias:</strong></li>
                                <ul>
                                    {sec}
                                </ul>
                            </ul>
                            <p>Clique neste link para verificar o cadastro:</p>
                            <p>Atenciosamente,<br>Equipe Letrajato</p>
                        </div>
                    </body>
                </html>
                """
            else:
                cnpj_formatado = cnpj[:2] + '.' + cnpj[2:5] + '.' + cnpj[5:8] + '/' + cnpj[8:12] + '-' + cnpj[12:]

                admin_html_message = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #FF5207;">Uma nova solicitação de cadastro foi realizada!</h2>
                            <p>Olá <strong>Otávio</strong>,</p>
                            <p>Um novo revendedor solicitou registro no sistema. A solicitação foi realizada pelo usuário {username}</p>
                            <p>para a empresa com nome {empresa}. Sua conta foi criada com sucesso e aguarda verificação.</p>
                            <p>O CNPJ fornecido no cadastro não foi encontrado no sistema, portanto a verificação deve ser manual:</p>
                            <ul>
                                <li><strong>CNPJ:</strong> {cnpj_formatado}</li>
                            </ul>
                            <p>Clique neste link para verificar o cadastro:</p>
                            <p>Atenciosamente,<br>Equipe Letrajato</p>
                        </div>
                    </body>
                </html>
                """
            
            email_message = EmailMultiAlternatives(
                subject=cliente_subject,
                body=cliente_plain_message,
                from_email=settings.EMAIL_HOST_USER,
                to=[email]
            )
            email_message.attach_alternative(cliente_html_message, "text/html")
            email_message.send(fail_silently=True)

            email_message = EmailMultiAlternatives(
                subject=admin_subject,
                body=admin_plain_message,
                from_email=settings.EMAIL_HOST_USER,
                to=["rftolini@gmail.com"]
            )
            email_message.attach_alternative(admin_html_message, "text/html")
            email_message.send(fail_silently=True)


        except Exception as e:
            print(f"Failed to send welcome email: {str(e)}")


class CNPJProxyView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, cnpj, format=None):
        api_url = f"https://receitaws.com.br/v1/cnpj/{cnpj}/days/10000/"
        headers = {
            "Authorization": "Bearer 9a8c5455498d101448212bd10ed467bc158a5333b6aacae8324ca1e236026ab7"
        }

        try:
            response = requests.get(api_url, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.RequestException as e:
            return Response(
                {"error": f"Error fetching CNPJ data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class EmailSendView(APIView):
    """
    API endpoint for sending emails
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            subject = request.data.get("subject")
            message = request.data.get("message")

            if not email or not subject or not message:
                return Response(
                    {"error": "Email, subject, and message are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create plain text version (optional)
            plain_message = "Este é um email de orçamento da Letrajato."

            # Create email
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,  # Plain text alternate version
                from_email=settings.EMAIL_HOST_USER,
                to=[email],
            )

            # Attach HTML content
            email_message.attach_alternative(message, "text/html")

            # Send email
            email_message.send(fail_silently=False)

            return Response(
                {"success": "Email sent successfully"}, status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"Failed to send email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )