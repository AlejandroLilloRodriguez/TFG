from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    class Roles(models.TextChoices):
        Admin = "ADMIN","Administrador"
        Empleado = "EMPLEADO","Empleado"
    
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=128)
    rol = models.CharField(max_length=10, choices=Roles.choices, default=Roles.Empleado)

    
    
class Vehiculo(models.Model):
    pass


# Create your models here.
