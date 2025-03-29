from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password']  # Liste des champs à inclure
        extra_kwargs = {'password': {'write_only': True}}  # Masquer le champ 'password' lors de la lecture
