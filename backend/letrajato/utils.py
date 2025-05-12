from django.core.email import send_mail, EmailMessage
from django.conf import settings


def send_email_attachment(subject, message, recipient_list, file_path):
    mail = EmailMessage(subject=subject,body= message, from_email=settings.EMAIL_HOST_USER,to= recipient_list)
    mail.attach_file(file_path)
    mail.send()
