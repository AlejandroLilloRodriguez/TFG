from django.shortcuts import render
from rest_framework import viewsets
from .models import Reserva
from .serializer import ReservaSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializer import AsignacionRequestSerializer
from services.algoritmodeasignacion import AlgoritmoDeAsignacion

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

class EjecutarAsignacionApiView(APIView):

    def post(self,request):
        serializer = AsignacionRequestSerializer(data=request.data)
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
