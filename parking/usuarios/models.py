from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    class Roles(models.TextChoices):
        Admin = "ADMIN","Administrador"
        Empleado = "EMPLEADO","Empleado"
    
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=10, choices=Roles.choices, default=Roles.Empleado)

    
    def __str__(self):
        return f"{self.username} ({self.rol})"


# Create your models here.
