from rest_framework import serializers
from .models import LecturaMatricula


class MatriculaRequestSerializer(serializers.Serializer):
    matricula = serializers.CharField(max_length=15)


class LecturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LecturaMatricula
        fields = "__all__"
        read_only_fields = fields
