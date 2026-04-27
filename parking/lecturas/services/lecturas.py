from vehiculo.models import Vehiculo
from reservas.models import Reserva, Estado
from lecturas.models import LecturaMatricula


class LecturasService:
    def leerMatricula(self, matricula, fecha):
        matricula = matricula.strip().upper()
        vehiculo = Vehiculo.objects.filter(matricula__iexact=matricula).first()

        if not vehiculo:
            LecturaMatricula.objects.create(
                matricula=matricula,
                tipo=LecturaMatricula.TipoLectura.Entrada,
                resultado=LecturaMatricula.ResultadoLectura.DENEGADO,
            )
            return {"resultado": "DENEGADO"}

        reserva_ocupada = Reserva.objects.filter(
            vehiculo=vehiculo,
            estado=Estado.OCUPADA,
        ).select_related("plaza", "plaza__planta").first()

        if reserva_ocupada:
            LecturaMatricula.objects.create(
                matricula=matricula,
                tipo=LecturaMatricula.TipoLectura.Entrada,
                resultado=LecturaMatricula.ResultadoLectura.DENEGADO,
                reserva=reserva_ocupada,
            )
            return {
                "resultado": "YA_DENTRO",
                "plaza": {
                    "numero": reserva_ocupada.plaza.numero if reserva_ocupada.plaza else None,
                    "planta": reserva_ocupada.plaza.planta.nivel if reserva_ocupada.plaza else None,
                },
            }

        reserva = Reserva.objects.filter(
            vehiculo=vehiculo,
            fecha=fecha,
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

    def registrarSalida(self, matricula, fecha=None):
        matricula = matricula.strip().upper()
        vehiculo = Vehiculo.objects.filter(matricula__iexact=matricula).first()

        if not vehiculo:
            LecturaMatricula.objects.create(
                matricula=matricula,
                tipo=LecturaMatricula.TipoLectura.Salida,
                resultado=LecturaMatricula.ResultadoLectura.DENEGADO,
            )
            return {"resultado": "DENEGADO"}

        reserva = Reserva.objects.filter(
            vehiculo=vehiculo,
            estado=Estado.OCUPADA,
        ).select_related("plaza").order_by("-fecha").first()

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

    def cerrarReservasSinSalida(self, fecha_limite=None):
        reservas = Reserva.objects.filter(
            estado=Estado.OCUPADA,
        ).select_related("plaza")

        if fecha_limite is not None:
            reservas = reservas.filter(fecha__lte=fecha_limite)

        cerradas = 0
        plazas_liberadas = 0

        for reserva in reservas:
            reserva.estado = Estado.SALIDA_NO_REGISTRADA
            reserva.save(update_fields=["estado"])
            cerradas += 1

            if reserva.plaza_id is not None:
                plaza = reserva.plaza
                plaza.disponible = True
                plaza.save(update_fields=["disponible"])
                plazas_liberadas += 1

        return {
            "cerradas": cerradas,
            "plazas_liberadas": plazas_liberadas,
        }