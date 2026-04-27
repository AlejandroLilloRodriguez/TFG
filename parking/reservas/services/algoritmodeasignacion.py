from reservas.models import Reserva, Estado
from plazas.models import Plaza


class AlgoritmoDeAsignacion:

    def calcularScore(self, usuario):
        reservas = Reserva.objects.filter(usuario=usuario).exclude(
            estado=Estado.CANCELADA
        )

        total_reservas = reservas.count()
        no_shows = reservas.filter(estado=Estado.NO_SHOW).count()
        usadas = reservas.filter(estado=Estado.FINALIZADA).count()

        score = 0
        score += total_reservas * 5
        score += no_shows * 20
        score -= usadas * 3

        return score

    def asignarReserva(self, fechaActual):
        reservas = list(
            Reserva.objects.filter(
                estado=Estado.PENDIENTE,
                fechaInicio__date=fechaActual,
            ).order_by("id")
        )

        reservas.sort(key=lambda r: self.calcularScore(r.usuario))

        plazas_libres = list(Plaza.objects.filter(disponible=True).order_by("id"))

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