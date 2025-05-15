from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("cnpj/<str:cnpj>/", views.CNPJProxyView.as_view(), name="cnpj-proxy"),
    path("send-email/", views.EmailSendView.as_view(), name="send-email"),
    path("verify/<str:token>/", views.VerifyUserView.as_view(), name="verify-user"),
    path("verify-status/", views.UserVerificationStatusView.as_view(), name="verify-status"),
    path("admin/users/", views.AdminUsersView.as_view(), name="admin-users"),
    path("check-admin/", views.CheckAdminStatusView.as_view(), name="check-admin"),
    path("tickets/", views.TicketListCreateView.as_view(), name="ticket-list-create"),
    path("tickets/<int:ticket_id>/", views.TicketDetailView.as_view(), name="ticket-detail"),
    path("tickets/<int:ticket_id>/messages/", views.TicketMessageView.as_view(), name="ticket-messages"),
    path('download-attachment/<int:attachment_id>/', views.DownloadAttachmentView.as_view(), name='download_attachment'),
]
