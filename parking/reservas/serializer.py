from rest_framework import serializers
from reservas.models import Reserva


class ReservaSerializer(serializers.ModelSerializer):
    usuario = serializers.CharField(source="usuario.username", read_only=True)
    class Meta:
        model = Reserva
        fields = [
            "id",
            "fechaInicio",
            "fechaFinal",
            "estado",
            "usuario",
            "vehiculo",
            "plaza",
        ]
        read_only_fields = ["id", "estado", "usuario", "plaza"]


class AsignacionRequestSerializer(serializers.Serializer):
    fecha = serializers.DateField()

class NoShowRequestSerializer(serializers.Serializer):
    fecha = serializers.DateField()
    horaLimite = serializers.TimeField()




