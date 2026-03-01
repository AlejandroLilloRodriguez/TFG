from informes.models import InformesUso
from reservas.models import Reserva, Estado
from plazas.models import Plaza


class AlgoritmoDeAsignacion:

    def clacularScore(self, usuario):
        informe = InformesUso.objects.filter(usuario=usuario).order_by("-fechaCreacion").first()
        if not informe:
            return 100
        score = 0
        score += informe.noshows * 20
        score += informe.totalReservas * 5
        diasSinUsar = (informe.periodoFinal - informe.periodoInicio).days
        score -= diasSinUsar
        return score

    def asignarReserva(self, fechaActual):
        reservas = list(
            Reserva.objects.filter(
                estado=Estado.PENDIENTE,
                fechaInicio__date=fechaActual,
            )
        )
        reservas.sort(key=lambda r: self.clacularScore(r.usuario))

        
        plazas_libres = list(Plaza.objects.filter(disponible=True).order_by("id"))

        asignadas = 0
        no_asignadas = 0

       
        for reserva in reservas:
            if plazas_libres:
                plaza = plazas_libres.pop(0)
                reserva.disponible = False
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
