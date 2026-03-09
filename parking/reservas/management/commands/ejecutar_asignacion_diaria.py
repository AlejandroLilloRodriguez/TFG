from django.core.management.base import BaseCommand
from django.utils import timezone
from reservas.services.algoritmodeasignacion import AlgoritmoDeAsignacion

class Command(BaseCommand):
    help = "Ejecuta la asignación diaria de plazas para la fecha de hoy"

    def handle(self, *args, **options):
        fecha = timezone.localdate()
        algoritmo = AlgoritmoDeAsignacion()
        asignadas, no_asignadas = algoritmo.asignarReserva(fecha)

        self.stdout.write(self.style.SUCCESS(
            f"[Asignación] {fecha} -> asignadas={asignadas}, no_asignadas={no_asignadas}"
        ))