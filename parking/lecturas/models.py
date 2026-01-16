from django.db import models
from django.utils import timezone
from reservas.models import Reserva



class LecturaMatricula(models.Model):
    class TipoLectura(models.TextChoices):
        Entrada = "ENTRADA","Entrada"
        Salida = "SALIDA","Salida"
    class ResultadoLectura(models.TextChoices):
        OK = "OK", "Correcto"
        SIN_RESERVA = "SIN_RESERVA", "Sin reserva"
        DENEGADO = "DENEGADO", "Denegado"
        ERROR = "ERROR", "Error"

    matricula = models.CharField(max_length = 15)
    fechaHora = models.DateTimeField(default=timezone.now)

    tipo = models.CharField(max_length=10, choices=TipoLectura.choices)
    resultado = models.CharField(max_length=10,choices = ResultadoLectura.choices)
    reserva = models.ForeignKey(
    Reserva,
    on_delete=models.SET_NULL,
    null=True
    )

    def __str__(self):
        return f"{self.matricula} {self.tipo} {self.resultado} {self.fechaHora}"

