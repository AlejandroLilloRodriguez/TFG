from rest_framework import serializers
from usuarios.models import Usuario
from reservas.models import Reserva, Estado


class InformeSerializer(serializers.ModelSerializer):
    totalReservas = serializers.SerializerMethodField()
    reservasUsadas = serializers.SerializerMethodField()
    noshows = serializers.SerializerMethodField()
    porcentajeDeUso = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "totalReservas",
            "reservasUsadas",
            "noshows",
            "porcentajeDeUso",
        ]

    def get_totalReservas(self, obj):
        return Reserva.objects.filter(usuario=obj).exclude(estado=Estado.CANCELADA).count()

    def get_reservasUsadas(self, obj):
        return Reserva.objects.filter(usuario=obj, estado=Estado.FINALIZADA).count()

    def get_noshows(self, obj):
        return Reserva.objects.filter(usuario=obj, estado=Estado.NO_SHOW).count()

    def get_porcentajeDeUso(self, obj):
        total = Reserva.objects.filter(usuario=obj).exclude(estado=Estado.CANCELADA).count()
        usadas = Reserva.objects.filter(usuario=obj, estado=Estado.FINALIZADA).count()

        if total == 0:
            return 0.0

        return round((usadas / total) * 100, 2)