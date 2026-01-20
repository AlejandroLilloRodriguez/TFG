from rest_framework.routers import DefaultRouter
from .views import ReservaViewSet

router = DefaultRouter()
router.register(r"reservas", ReservaViewSet, basename="reservas")
router.register(r"ejecutar-asignacion", ReservaViewSet, basename="ejecutar-asignacion")

urlpatterns = router.urls
