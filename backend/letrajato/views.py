from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
import requests
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CNPJProxyView(APIView):
    """
    Proxy view for CNPJ API requests to avoid CORS issues
    """
    permission_classes = [AllowAny]  # Or [IsAuthenticated] if you want to require login

    def get(self, request, cnpj, format=None):
        api_url = f"https://receitaws.com.br/v1/cnpj/{cnpj}/days/10000/"
        headers = {
            "Authorization": "Bearer ba23a4de482d62f9850c26dadce7cf71e27c02b1ecfa8f96bfbdd5431974add2"
        }
        
        try:
            response = requests.get(api_url, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.RequestException as e:
            return Response(
                {"error": f"Error fetching CNPJ data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )