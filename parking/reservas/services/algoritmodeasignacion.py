from informes.models import InformesUso
from reservas.models import Reserva

class AlgoritmoDeAsignacion : 

    def clacularScore(self,usuario):
        informe = InformesUso.objects.filter(usuario=usuario).order_by('-fechaCreacion').first()
        if not informe :
            return 100
        score = 0
        score += informe.noshows * 20
        socre += informe.totalReservas * 5
        diasSinUsar = (informe.periodoFinal - informe.periodoInicio).days
        score += diasSinUsar
        return score
    
    def asignarReserva(self,fechaActual):
        reservas = list(Reserva.objects.filter(estado = "PENDIENTE", fechaInicio = fechaActual))
        reservas.sort(key=lambda reserva: self.clacularScore(reserva.usuario))
        PlazasDisponibles = 100
        asignadas = 0
        no_asignadas = 0
        for reserva in reservas:
            if PlazasDisponibles > 0:
                reserva.estado = "ASIGNADA"
                reserva.save()
                PlazasDisponibles -= 1
                asignadas += 1
            else:
                reserva.estado = "NO_ASIGNADA"
                reserva.save()
                no_asignadas += 1
        return asignadas, no_asignadas
    