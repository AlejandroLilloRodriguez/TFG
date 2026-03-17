from rest_framework import serializers
from .models import Informe

class InformeSerializer(serializers.ModelSerializer):
    usuario = serializers.CharField(source='usuario.username', read_only=True)
    class Meta:
        model = Informe
        fields = [ "usuario", "totalReservas", "reservasUsadas", "noshows", "porcentajeDeUso", "fechaCreacion", "periodoInicio", "periodoFinal"]
        