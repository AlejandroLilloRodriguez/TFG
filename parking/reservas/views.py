from django.shortcuts import render
from rest_framework import viewsets
from .models import Reserva
from .serializer import ReservaSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializer import AsignacionRequestSerializer
from .services.algoritmodeasignacion import AlgoritmoDeAsignacion
from rest_framework.permissions import IsAuthenticated
from .permisos import EsAdminUsuarioPermiso as EsAdmin

class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer
    def get_queryset(self):
        user = self.request.user
        if getattr(user, "rol", None) == "ADMIN":
            return Reserva.objects.all()
        else :
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

        

# Create your views here.
