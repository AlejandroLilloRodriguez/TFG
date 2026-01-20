from django.shortcuts import render
from rest_framework import viewsets
from .models import Vehiculo
from .serializer import VehiculoSerializer

class VehiculoViewSet(viewsets.ModelViewSet):
    serializer_class = VehiculoSerializer
    def get_queryset(self):
        if getattr(self.request.user, "rol", None) == "ADMIN":
            return Vehiculo.objects.all()
        else:
            return Vehiculo.objects.filter(usuario=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

# Create your views here.
