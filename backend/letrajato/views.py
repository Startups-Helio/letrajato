from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer, SupportTicketSerializer, TicketMessageSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, CustomUser, Revendedor, SupportTicket, TicketMessage
from django.core.mail import send_mail, EmailMultiAlternatives
import requests
from django.conf import settings
import threading
import uuid
from django.http import Http404, HttpResponse
import os
import base64
import time
from email.mime.base import MIMEBase
from django.utils import timezone

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
            args=(user.email, user.username, user.revendedor.nome_empresa, user.revendedor.cnpj, consulta_data)
        ).start()
    
    def _send_welcome_email(self, email, username, empresa, cnpj, consulta_data):
        try:
            user = CustomUser.objects.get(email=email)
            revendedor = user.revendedor
            verification_url = f"https://letrajato.com.br/admin"

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
                            <p>Olá <strong>Octávio</strong>,</p>
                            <p>Um novo revendedor solicitou registro no sistema. A solicitação foi realizada pelo usuário {username} 
                            para a empresa com nome {empresa}.</p>
                            <p>A conta foi criada com sucesso e aguarda verificação.</p>
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
                            <p>Entre no Admin Dashboard para verificar o cadastro: <a href="{verification_url}">Verificar Usuário</a></p>
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
                            <p>Olá <strong>Octávio</strong>,</p>
                            <p>Um novo revendedor solicitou registro no sistema. A solicitação foi realizada pelo usuário {username} 
                            para a empresa com nome {empresa}.</p>
                            <p>A conta foi criada com sucesso e aguarda verificação.</p>
                            <p>O CNPJ fornecido no cadastro não foi encontrado no sistema, portanto a verificação deve ser manual:</p>
                            <ul>
                                <li><strong>CNPJ:</strong> {cnpj_formatado}</li>
                            </ul>
                            <p>Entre no Admin Dashboard para verificar o cadastro: <a href="{verification_url}">Verificar Usuário</a></p>
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
                to=["letrajato@gmail.com"]
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
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            email = request.user.email
            subject = request.data.get("subject")
            message = request.data.get("message")
            # svg_image = request.data.get("image", None)

            email_message = EmailMultiAlternatives(
                subject=subject,
                body="Este é um e-mail HTML. Por favor, use um cliente de e-mail que suporte HTML.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email, 'orcamentos@letrajato.com']
            )
            email_message.attach_alternative(message, "text/html")
            email_message.send(fail_silently=False)
            return Response({"message": "Email sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

#?????
class VerifyUserView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, token, format=None):
        try:

            verification_token = uuid.UUID(token)
            revendedor = Revendedor.objects.get(verification_token=verification_token)
            revendedor.verificado = True
            revendedor.save()
            
            user = revendedor.user
            
            self._send_verification_confirmation(user, revendedor)
            
            html_content = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Verificação de Usuário</title>
                    <script>
                        // Auto-close after showing success message
                        window.onload = function() {{
                            setTimeout(function() {{
                                window.close();
                            }}, 1500);  // Close after 1.5 seconds
                        }}
                    </script>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding-top: 100px;
                        }}
                        .success {{
                            color: #4CAF50;
                            font-size: 24px;
                        }}
                        .message {{
                            margin-top: 20px;
                            color: #666;
                        }}
                    </style>
                </head>
                <body>
                    <div class="success">✓ Verificação concluída</div>
                    <div class="message">O usuário {user.username} foi verificado com sucesso!</div>
                    <div class="message">Esta janela será fechada automaticamente...</div>
                </body>
                </html>
            """
            
            return HttpResponse(html_content, content_type='text/html')
            
        except ValueError:
            return HttpResponse("Token inválido", status=400)
        except Revendedor.DoesNotExist:
            return HttpResponse("Revendedor não encontrado", status=404)
        except Exception as e:
            return HttpResponse(f"Erro: {str(e)}", status=500)
    
    def _send_verification_confirmation(self, user, revendedor):
        try:
            subject = "Conta verificada com sucesso"
            plain_message = f"Olá {user.username}, sua conta na Letrajato foi verificada com sucesso."
            html_message = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #FF5207;">Conta Verificada!</h2>
                            <p>Olá <strong>{user.username}</strong>,</p>
                            <p>Sua conta para <strong>{revendedor.nome_empresa}</strong> foi verificada com sucesso!</p>
                            <p>Agora você é um de nossos parceiros e tem acesso completo à plataforma Letrajato!</p>
                            <p>Atenciosamente,<br>Equipe Letrajato</p>
                        </div>
                    </body>
                </html>
            """
            
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=settings.EMAIL_HOST_USER,
                to=[user.email]
            )
            email_message.attach_alternative(html_message, "text/html")
            email_message.send(fail_silently=True)
        
        except Exception as e:
            print(f"Failed to send verification confirmation: {str(e)}")


class UserVerificationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_revendedor = hasattr(user, 'revendedor')
        
        data = {
            'email': user.email,
            'is_revendedor': is_revendedor,
            'is_staff': user.is_staff
        }
        
        if is_revendedor:
            data['verificado'] = user.revendedor.verificado
            data['nome_empresa'] = user.revendedor.nome_empresa
            data['cnpj'] = user.revendedor.cnpj
        else:
            data['verificado'] = False
            
        return Response(data, status=status.HTTP_200_OK)

class AdminUsersView(APIView):

    permission_classes = [IsAuthenticated]
    
    def get(self, request):

        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access this resource"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        unverified_revendedores = Revendedor.objects.filter(verificado=False)
        users_data = []
        
        for revendedor in unverified_revendedores:
            user = revendedor.user
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "nome_empresa": revendedor.nome_empresa,
                "cnpj": revendedor.cnpj,
                "cnpj_data": revendedor.cnpj_data,
                "is_revendedor": True,
                "verificado": False
            }
            users_data.append(user_data)
        
        return Response(users_data, status=status.HTTP_200_OK)
    
    def post(self, request):

        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access this resource"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_id = request.data.get('user_id')
        action = request.data.get('action')
        
        if not user_id or action not in ['approve', 'deny']:
            return Response(
                {"error": "Missing required parameters or invalid action"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = CustomUser.objects.get(id=user_id)
            
            if not hasattr(user, 'revendedor'):
                return Response(
                    {"error": "User is not a revendedor"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if action == 'approve':

                user.revendedor.verificado = True
                user.revendedor.save()
                
                self._send_approval_email(user)
                
                return Response(
                    {"message": "Revendedor approved successfully"},
                    status=status.HTTP_200_OK
                )
            else:

                user.revendedor.delete()
                
                self._send_denial_email(user)
                
                return Response(
                    {"message": "Revendedor denied, converted to normal user"},
                    status=status.HTTP_200_OK
                )
                
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def _send_approval_email(self, user):

        try:
            subject = "Cadastro de Revendedor Aprovado - Letrajato"
            message = f"""
                Olá {user.username},
                
                Temos o prazer de informar que seu cadastro como revendedor foi aprovado!
                Agora você tem acesso a todos os recursos de revendedor na plataforma Letrajato.
                
                Atenciosamente,
                Equipe Letrajato
            """
            
            html_message = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #ff5722;">Cadastro de Revendedor Aprovado!</h2>
                        <p>Olá <strong>{user.username}</strong>,</p>
                        <p>Temos o prazer de informar que seu cadastro como revendedor foi <strong style="color: green;">aprovado</strong>!</p>
                        <p>Agora você tem acesso a todos os recursos de revendedor na plataforma Letrajato, incluindo:</p>
                        <ul>
                            <li>Cálculo de orçamentos avançado</li>
                            <li>Preços exclusivos de revendedor</li>
                            <li>Acesso à área de revendedor</li>
                        </ul>
                        <p>Entre agora mesmo e aproveite todos os benefícios!</p>
                        <p>Atenciosamente,<br>Equipe Letrajato</p>
                    </div>
                </body>
            </html>
            """
            
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email]
            )
            email_message.attach_alternative(html_message, "text/html")
            email_message.send()
            
        except Exception as e:
            print(f"Failed to send approval email: {str(e)}")
    
    def _send_denial_email(self, user):

        try:
            subject = "Atualização do seu Cadastro - Letrajato"
            message = f"""
                Olá {user.username},
                
                Lamentamos informar que seu cadastro como revendedor não foi aprovado neste momento.
                No entanto, seu cadastro foi mantido e você pode acessar
                a plataforma Letrajato normalmente.
                
                Caso tenha dúvidas, entre em contato com nossa equipe de suporte.
                
                Atenciosamente,
                Equipe Letrajato
            """
            
            html_message = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #ff5722;">Atualização do seu Cadastro</h2>
                        <p>Olá <strong>{user.username}</strong>,</p>
                        <p>Informamos que seu cadastro como revendedor não foi aprovado neste momento.</p>
                        <p>No entanto, <strong>seu cadastro foi mantido</strong>, e você pode acessar a plataforma Letrajato normalmente.</p>
                        <p>Caso tenha dúvidas ou queira mais informações, entre em contato com nossa equipe de suporte.</p>
                        <p>Atenciosamente,<br>Equipe Letrajato</p>
                    </div>
                </body>
            </html>
            """
            
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email]
            )
            email_message.attach_alternative(html_message, "text/html")
            email_message.send()
            
        except Exception as e:
            print(f"Failed to send denial email: {str(e)}")

class CheckAdminStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        is_admin = request.user.is_staff
        return Response({
            'is_admin': is_admin,
        }, status=status.HTTP_200_OK)

class TicketListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.is_staff:
            tickets = SupportTicket.objects.all().order_by('-created_at')
        else:
            tickets = SupportTicket.objects.filter(user=request.user).order_by('-created_at')
            
        serializer = SupportTicketSerializer(tickets, many=True)
        return Response(serializer.data)
    
    def post(self, request):

        data = request.data.copy()
        data['user'] = request.user.id
        
        serializer = SupportTicketSerializer(data=data)
        if serializer.is_valid():
            ticket = serializer.save(user=request.user)
            
            if 'message' in request.data and request.data['message']:
                TicketMessage.objects.create(
                    ticket=ticket,
                    sender=request.user,
                    message=request.data['message'],
                    is_from_admin=False
                )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TicketDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, ticket_id, user):
        try:
            if user.is_staff:
                return SupportTicket.objects.get(id=ticket_id)
            return SupportTicket.objects.get(id=ticket_id, user=user)
        except SupportTicket.DoesNotExist:
            raise Http404
    
    def get(self, request, ticket_id):
        ticket = self.get_object(ticket_id, request.user)
        serializer = SupportTicketSerializer(ticket)
        return Response(serializer.data)
    
    def patch(self, request, ticket_id):
        ticket = self.get_object(ticket_id, request.user)
        
        if 'status' in request.data and not request.user.is_staff:
            return Response(
                {"error": "Only admin can change ticket status"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = SupportTicketSerializer(ticket, data=request.data, partial=True)
        if serializer.is_valid():
            if request.data.get('status') == 'closed' and ticket.status != 'closed':
                serializer.save(closed_at=timezone.now())
            else:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TicketMessageView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_ticket(self, ticket_id, user):
        try:
            if user.is_staff:
                return SupportTicket.objects.get(id=ticket_id)
            return SupportTicket.objects.get(id=ticket_id, user=user)
        except SupportTicket.DoesNotExist:
            raise Http404
    
    def get(self, request, ticket_id):
        ticket = self.get_ticket(ticket_id, request.user)
        messages = ticket.messages.all().order_by('created_at')
        serializer = TicketMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    def post(self, request, ticket_id):
        ticket = self.get_ticket(ticket_id, request.user)
        
        if ticket.status == 'closed':
            return Response(
                {"error": "Cannot add messages to closed tickets"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        message_text = request.data.get('message', '')
        attachment = request.FILES.get('attachment', None)
        
        # max 10MB
        if attachment and attachment.size > 10 * 1024 * 1024:
            return Response(
                {"error": "File size exceeds 10MB limit"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        message = TicketMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            message=message_text,
            is_from_admin=request.user.is_staff,
            attachment=attachment
        )
        
        if request.user.is_staff and ticket.status == 'open':
            ticket.status = 'in_progress'
            ticket.save()
        
        serializer = TicketMessageSerializer(message, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)