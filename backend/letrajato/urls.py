from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("cnpj/<str:cnpj>/", views.CNPJProxyView.as_view(), name="cnpj-proxy"),
    path("send-email/", views.EmailSendView.as_view(), name="send-email"),
    path("send-email-abate/", views.EmailSendAbateView.as_view(), name="send-email-abate"),

]
