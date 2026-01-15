from django.db import models
from usuarios.models import Usuario
from plazas.models import Plaza


class Estado(models.TextChoices):
    RESERVADA = "RESERVADA", "Reservada"
    OCUPADA = "OCUPADA", "Ocupada en plaza"
    FINALIZADA = "FINALIZADA", "Finalizada"
    CANCELADA = "CANCELADA", "Cancelada"
    NO_SHOW = "NO_SHOW", "No se presentó"

class Reserva(models.Model):
    fechaInicio = models.DateTimeField()
    fechaFinal = models.DateTimeField()
    estado = models.CharField(max_length=20,choices=Estado.choices,default=Estado.RESERVADA)
    usuario = models.ForeignKey()
    plaza = models.ForeignKey()

    # Hay que tener en cuenta que queremos que los usuarios se apunten a un dia y el algoritmo le asigna unas plazas segun unas reglas predefinidas
    
# Create your models here.
