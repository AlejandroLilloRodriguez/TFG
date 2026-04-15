from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from lecturas.services.lecturas import LecturasService
from .serializer import MatriculaRequestSerializer


class EntradaApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MatriculaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        matricula = serializer.validated_data["matricula"]
        fecha = serializer.validated_data["fecha"]
        data = LecturasService().leerMatricula(matricula, fecha)
        return Response({"resultado": data})


class SalidaApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MatriculaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        matricula = serializer.validated_data["matricula"]
        fecha = serializer.validated_data["fecha"]
        data = LecturasService().registrarSalida(matricula, fecha)
        return Response({"resultado": data})
