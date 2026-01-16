from django.db import models
from usuarios.models import Usuario

class InformesUso(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE
    )
    totalReservas = models.IntegerField(default=0)
    reservasUsadas  = models.IntegerField(default = 0)
    noshows = models.IntegerField(default = 0)
    porcentajeDeUso = models.FloatField(default=0.0)
    fechaCreacion = models.DateTimeField(auto_now_add=True)
    periodoInicio = models.DateField()
    periodoFinal = models.DateField()

    def __str__(self):
        return f"{self.usuario.username} ({self.periodoInicio} - {self.periodoFinal})"

# Create your models here.
