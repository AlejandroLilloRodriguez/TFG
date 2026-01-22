from django.db import models
from usuarios.models import Usuario
from plazas.models import Plaza
from vehiculo.models import Vehiculo

class Estado(models.TextChoices):
    PENDIENTE = "PENDIENTE", "Pendiente de asignación"
    ASIGNADA = "ASIGNADA", "Asignada"
    NO_ASIGNADA = "NO_ASIGNADA", "No asignada"
    OCUPADA = "OCUPADA", "Ocupada en plaza"
    FINALIZADA = "FINALIZADA", "Finalizada"
    CANCELADA = "CANCELADA", "Cancelada"
    NO_SHOW = "NO_SHOW", "No se presentó"

class Reserva(models.Model):
    fechaInicio = models.DateTimeField()
    fechaFinal = models.DateTimeField()

    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE)

    plaza = models.ForeignKey(
        Plaza,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reservas"
    )

    def __str__(self):
        return f"Reserva {self.usuario.username} {self.fechaInicio} ({self.estado})"

