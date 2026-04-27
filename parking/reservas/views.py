from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.utils import timezone
from datetime import datetime

from .models import Reserva, Estado
from .serializer import (
    ReservaSerializer,
    AsignacionRequestSerializer,
    NoShowRequestSerializer,
)
from .services.algoritmodeasignacion import AlgoritmoDeAsignacion
from .permisos import EsAdminUsuarioPermiso as EsAdmin


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "rol", None) == "ADMIN":
            queryset = Reserva.objects.all()
        else:
            queryset = Reserva.objects.filter(usuario=user)

        fecha_inicio = self.request.query_params.get("fecha_inicio")
        fecha_fin = self.request.query_params.get("fecha_fin")

        if fecha_inicio:
            queryset = queryset.filter(fecha__gte=fecha_inicio)

        if fecha_fin:
            queryset = queryset.filter(fecha__lte=fecha_fin)

        return queryset.order_by("-fecha")

    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        reserva = self.get_object()

        if getattr(request.user, "rol", None) != "ADMIN" and reserva.usuario != request.user:
            return Response(
                {"detail": "No tienes permiso para cancelar esta reserva."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if reserva.estado not in [Estado.PENDIENTE, Estado.ASIGNADA]:
            return Response(
                {"detail": "Solo se pueden cancelar reservas pendientes o asignadas."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if reserva.estado == Estado.ASIGNADA and reserva.plaza is not None:
            plaza = reserva.plaza
            plaza.disponible = True
            plaza.save(update_fields=["disponible"])

        reserva.estado = Estado.CANCELADA
        reserva.save(update_fields=["estado"])

        return Response(
            {"detail": "Reserva cancelada correctamente."},
            status=status.HTTP_200_OK
        )

    def perform_create(self, serializer):
        usuario = self.request.user
        fecha = serializer.validated_data.get("fecha")

        existe_reserva = Reserva.objects.filter(
            usuario=usuario,
            fecha=fecha,
        ).exclude(
            estado__in=[Estado.CANCELADA, Estado.FINALIZADA]
        ).exists()

        if existe_reserva:
            raise serializers.ValidationError(
                {"detail": "Ya tienes una reserva para ese día."}
            )

        serializer.save(usuario=usuario, estado=Estado.PENDIENTE)


class EjecutarAsignacionApiView(APIView):
    permission_classes = [IsAuthenticated, EsAdmin]

    def post(self, request):
        serializer = AsignacionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        fecha = serializer.validated_data["fecha"]

        algoritmo = AlgoritmoDeAsignacion()
        asignadas, no_asignadas = algoritmo.asignarReserva(fecha)

        return Response(
            {
                "asignadas": asignadas,
                "no_asignadas": no_asignadas,
            },
            status=status.HTTP_200_OK
        )


class EjecutarNoShowApiView(APIView):
    permission_classes = [IsAuthenticated, EsAdmin]

    def post(self, request):
        serializer = NoShowRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        fecha = serializer.validated_data["fecha"]
        horaLimite = serializer.validated_data["horaLimite"]

        dt_limite = timezone.make_aware(datetime.combine(fecha, horaLimite))

        if timezone.now() < dt_limite:
            return Response(
                {
                    "detail": "Aún no se ha alcanzado la hora límite.",
                    "horaLimite": str(horaLimite),
                    "fecha": str(fecha),
                },
                status=status.HTTP_200_OK,
            )

        reservas = Reserva.objects.filter(
            fecha=fecha,
            estado=Estado.ASIGNADA,
        ).select_related("plaza")

        marcadas = 0
        plazas_liberadas = 0

        for r in reservas:
            r.estado = Estado.NO_SHOW
            r.save(update_fields=["estado"])
            marcadas += 1

            if r.plaza is not None:
                plaza = r.plaza
                plaza.disponible = True
                plaza.save(update_fields=["disponible"])
                plazas_liberadas += 1

        return Response(
            {
                "no_shows_marcados": marcadas,
                "plazas_liberadas": plazas_liberadas,
            },
            status=status.HTTP_200_OK,
        )