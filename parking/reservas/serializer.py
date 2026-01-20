from reservas.models import Reserva
from rest_framework import serializers

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'

class AsignacionRequestSerializer(serializers.Serializer):
    fecha = serializers.DateField()