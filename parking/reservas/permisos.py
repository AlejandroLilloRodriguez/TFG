from rest_framework.permissions import BasePermission

class EsAdminUsuarioPermiso(BasePermission):

    def has_permission(self, request):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "rol", None) == "ADMIN"
        )