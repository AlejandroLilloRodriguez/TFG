from django.db import models
from usuarios.models import Usuario

class Vehiculo(models.Model):
    matricula = models.CharField(max_length=20, unique=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.matricula} - {self.usuario.username}"



# Create your models here.
