from django.shortcuts import render
from rest_framework import viewsets
from .models import Reserva, Estado
from .serializer import ReservaSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializer import AsignacionRequestSerializer
from .services.algoritmodeasignacion import AlgoritmoDeAsignacion
from rest_framework.permissions import IsAuthenticated
from .permisos import EsAdminUsuarioPermiso as EsAdmin
from django.utils import timezone
from datetime import datetime
from .serializer import NoShowRequestSerializer

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        print("AUTH HEADER:", request.headers.get("Authorization"))
        print("USER:", request.user, "is_authenticated:", request.user.is_authenticated)
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "rol", None) == "ADMIN":
            return Reserva.objects.all()
        return Reserva.objects.filter(usuario=user)

class EjecutarAsignacionApiView(APIView):
    permission_classes = [IsAuthenticated, EsAdmin]
    def post(self,request):
        serializer = AsignacionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fecha = serializer.validated_data['fecha']
        algoritmo = AlgoritmoDeAsignacion()
        asignadas, no_asignadas = algoritmo.asignarReserva(fecha)
        return Response(
            {
                "asignadas": asignadas,
                "no_asignadas": no_asignadas
            },
            status=status.HTTP_200_OK
        )

class EjecutarNoShowApiView(APIView):
    permission_classes = [IsAuthenticated, EsAdmin]

    def post(self, request):
        
        serializer = NoShowRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        fecha = serializer.validated_data["fecha"]
        hora_limite = serializer.validated_data["hora_limite"]

        dt_limite = timezone.make_aware(datetime.combine(fecha, hora_limite))

        
        if timezone.now() < dt_limite:
            return Response(
                {
                    "detail": "Aún no se ha alcanzado la hora límite.",
                    "hora_limite": str(hora_limite),
                    "fecha": str(fecha),
                },
                status=status.HTTP_200_OK,
            )

        
        reservas = Reserva.objects.filter(
            fechaInicio__date=fecha,
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

        

# Create your views here.
