from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import InformeViewSet

router = DefaultRouter()
router.register(r"", InformeViewSet, basename="informes")
urlpatterns = router.urls
