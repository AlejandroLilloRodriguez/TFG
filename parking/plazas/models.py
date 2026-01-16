from django.db import models

class Planta(models.Model):
    nivel = models.IntegerField()
    numeroPlazas = models.IntegerField()
    
    def __str__(self):
        return str(self.nivel)
    
class Plaza(models.Model):
    numero = models.IntegerField()
    disponible = models.BooleanField(default= True)
    planta = models.ForeignKey(Planta,on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('numero', 'planta')
    
    def __str__(self):
        return f"Plaza {self.numero} - {self.planta.nivel}"
# Create your models here.
