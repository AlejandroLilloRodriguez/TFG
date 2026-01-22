from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ReservaViewSet, EjecutarAsignacionApiView

router = DefaultRouter()
router.register(r"reservas", ReservaViewSet, basename="reservas")

urlpatterns = router.urls + [
    path("ejecutar-asignacion/", EjecutarAsignacionApiView.as_view(), name="ejecutar-asignacion"),
]
