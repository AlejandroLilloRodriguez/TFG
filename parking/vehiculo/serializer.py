from rest_framework import serializers
from .models import Vehiculo

class VehiculoSerializer(serializers.ModelSerializer):
    usuario = serializers.CharField(source="usuario.username", read_only=True)
    class Meta:
        model = Vehiculo
        fields = ["id", "matricula", "usuario"]
        read_only_fields = ["id", "usuario"]

