from django.utils import timezone
from vehiculo.models import Vehiculo
from reservas.models import Reserva, Estado
from lecturas.models import LecturaMatricula


class LecturasService:
    def leerMatricula(self, matricula):
        fecha = timezone.now().date()
        vehiculo = Vehiculo.objects.filter(matricula=matricula).first()

        if not vehiculo:
            LecturaMatricula.objects.create(
                matricula=matricula,
                tipo=LecturaMatricula.TipoLectura.Entrada,
                resultado=LecturaMatricula.ResultadoLectura.DENEGADO,
            )
            return {"resultado": "DENEGADO"}

        reserva = Reserva.objects.filter(
            vehiculo=vehiculo,
            fechaInicio__date=fecha,
            estado=Estado.ASIGNADA,
        ).select_related("plaza", "plaza__planta").first()

        if not reserva:
            LecturaMatricula.objects.create(
                matricula=matricula,
                tipo=LecturaMatricula.TipoLectura.Entrada,
                resultado=LecturaMatricula.ResultadoLectura.SIN_RESERVA,
            )
            return {"resultado": "SIN_RESERVA"}

        reserva.estado = Estado.OCUPADA
        reserva.save(update_fields=["estado"])

        LecturaMatricula.objects.create(
            matricula=matricula,
            tipo=LecturaMatricula.TipoLectura.Entrada,
            resultado=LecturaMatricula.ResultadoLectura.OK,
            reserva=reserva,
        )

        return {
            "resultado": "OK",
            "plaza": {
                "numero": reserva.plaza.numero,
                "planta": reserva.plaza.planta.nivel,
            },
        }


    def registrarSalida(self, matricula):
        fecha = timezone.now().date()
        vehiculo = Vehiculo.objects.filter(matricula=matricula).first()

        if not vehiculo:
            LecturaMatricula.objects.create(
                matricula=matricula,
                tipo=LecturaMatricula.TipoLectura.Salida,
                resultado=LecturaMatricula.ResultadoLectura.DENEGADO,
            )
            return {"resultado": "DENEGADO"}

        reserva = Reserva.objects.filter(
            vehiculo=vehiculo,
            fechaInicio__date=fecha,
            estado=Estado.OCUPADA,
        ).select_related("plaza").first()

        if not reserva:
            LecturaMatricula.objects.create(
                matricula=matricula,
                tipo=LecturaMatricula.TipoLectura.Salida,
                resultado=LecturaMatricula.ResultadoLectura.SIN_RESERVA,
            )
            return {"resultado": "SIN_RESERVA"}

        reserva.estado = Estado.FINALIZADA
        reserva.save(update_fields=["estado"])

    
        if reserva.plaza_id is not None:
            plaza = reserva.plaza
            plaza.disponible = True
            plaza.save(update_fields=["disponible"])

        LecturaMatricula.objects.create(
            matricula=matricula,
            tipo=LecturaMatricula.TipoLectura.Salida,
            resultado=LecturaMatricula.ResultadoLectura.OK,
            reserva=reserva,
        )

        return {"resultado": "OK"}
