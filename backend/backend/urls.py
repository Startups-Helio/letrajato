from django.contrib import admin
from django.urls import path, include
from letrajato.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("letrajato/user/register/", CreateUserView.as_view(), name="register"),
    path("letrajato/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("letrajato/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("letrajato-auth/", include("rest_framework.urls")),
    path("letrajato/", include("letrajato.urls")),
]
