from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("cnpj/<str:cnpj>/", views.CNPJProxyView.as_view(), name="cnpj-proxy"),
    path("send-email/", views.EmailSendView.as_view(), name="send-email"),
    path("verify/<str:token>/", views.VerifyUserView.as_view(), name="verify-user"),
    path("verify-status/", views.UserVerificationStatusView.as_view(), name="verify-status"),
    path("admin/users/", views.AdminUsersView.as_view(), name="admin-users"),  # Add this line
    path("check-admin/", views.CheckAdminStatusView.as_view(), name="check-admin"),

]
