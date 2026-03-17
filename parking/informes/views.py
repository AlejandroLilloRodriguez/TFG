from django.shortcuts import render
from rest_framework import viewsets
from .models import InformesUso
from .serializer import InformeSerializer
from rest_framework.permissions import IsAuthenticated

class InformeViewSet(viewsets.ModelViewSet):
    serializer_class = InformeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "rol", None) == "ADMIN":
            return InformesUso.objects.all()
        return InformesUso.objects.filter(usuario=user)

# Create your views here.
