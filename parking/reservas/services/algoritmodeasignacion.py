from reservas.models import Reserva, Estado
from plazas.models import Plaza


class AlgoritmoDeAsignacion:

    def calcularScore(self, usuario):
        reservas = Reserva.objects.filter(usuario=usuario)

        reservas_usadas = reservas.filter(estado=Estado.FINALIZADA).count()
        no_shows = reservas.filter(estado=Estado.NO_SHOW).count()
        reservas_canceladas = reservas.filter(estado=Estado.CANCELADA).count()

        score = 0
        score += reservas_usadas * 10
        score += no_shows * 30
        score += reservas_canceladas * 2

        return score

    def asignarReserva(self, fechaActual):
        reservas = list(
            Reserva.objects.filter(
                estado=Estado.PENDIENTE,
                fechaInicio__date=fechaActual,
            ).order_by("id")
        )

        reservas.sort(key=lambda r: (self.calcularScore(r.usuario), r.id))

        plazas_libres = list(
            Plaza.objects.filter(disponible=True).order_by("id")
        )

        asignadas = 0
        no_asignadas = 0

        for reserva in reservas:
            if plazas_libres:
                plaza = plazas_libres.pop(0)
                plaza.disponible = False
                plaza.save(update_fields=["disponible"])

                reserva.estado = Estado.ASIGNADA
                reserva.plaza = plaza
                reserva.save(update_fields=["estado", "plaza"])

                asignadas += 1
            else:
                reserva.estado = Estado.NO_ASIGNADA
                reserva.save(update_fields=["estado"])

                no_asignadas += 1

        return asignadas, no_asignadas