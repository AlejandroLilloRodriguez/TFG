from django.urls import path
from .views import EntradaApiView, SalidaApiView

urlpatterns = [
    path("lecturas/entrada/", EntradaApiView.as_view(), name="lecturas-entrada"),
    path("lecturas/salida/", SalidaApiView.as_view(), name="lecturas-salida"),
]
