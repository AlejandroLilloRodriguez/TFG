from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, time
from reservas.models import Reserva, Estado

class Command(BaseCommand):
    help = "Marca NO_SHOW reservas ASIGNADAS de hoy y libera plazas (si ya pasó la hora límite)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--hora-limite",
            type=str,
            default="09:15",
            help="Hora límite en formato HH:MM (default 09:15)",
        )

    def handle(self, *args, **options):
        fecha = timezone.localdate()
        hora_str = options["hora_limite"]

        h, m = map(int, hora_str.split(":"))
        dt_limite = timezone.make_aware(datetime.combine(fecha, time(h, m)))

        if timezone.now() < dt_limite:
            self.stdout.write(self.style.WARNING(
                f"[No-Show] Aún no se alcanzó la hora límite {hora_str} para {fecha}"
            ))
            return

        reservas = Reserva.objects.filter(
            fechaInicio__date=fecha,
            estado=Estado.ASIGNADA,
        ).select_related("plaza")

        marcadas = 0
        plazas_liberadas = 0

        for r in reservas:
            r.estado = Estado.NO_SHOW
            r.save(update_fields=["estado"])
            marcadas += 1

            if r.plaza_id:
                plaza = r.plaza
                plaza.disponible = True
                plaza.save(update_fields=["disponible"])
                plazas_liberadas += 1

        self.stdout.write(self.style.SUCCESS(
            f"[No-Show] {fecha} -> no_shows={marcadas}, plazas_liberadas={plazas_liberadas}"
        ))