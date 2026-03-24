from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from usuarios.models import Usuario
from .serializer import InformeSerializer


class InformeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InformeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "rol", None) == "ADMIN":
            return Usuario.objects.all()
        return Usuario.objects.filter(id=user.id)