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
        data = LecturasService().leerMatricula(matricula)
        return Response({"resultado": data})


class SalidaApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MatriculaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        matricula = serializer.validated_data["matricula"]
        data = LecturasService().registrarSalida(matricula)
        return Response({"resultado": data})
