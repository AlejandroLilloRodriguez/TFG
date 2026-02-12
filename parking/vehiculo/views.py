from django.shortcuts import render
from rest_framework import viewsets
from .models import Vehiculo
from rest_framework.permissions import IsAuthenticated
from .serializer import VehiculoSerializer

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        if getattr(self.request.user, "rol", None) == "ADMIN":
            return Vehiculo.objects.all()
        else:
            return Vehiculo.objects.filter(usuario=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

# Create your views here.
