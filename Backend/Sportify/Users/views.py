from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserSerializer

@api_view(['POST'])
def register_view (request):
    if request.method == 'POST':
        data = request.data.copy()
        password = data.get('password')

        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)



        user_serializer = CustomUserSerializer(data=data)

        if user_serializer.is_valid():
            user = user_serializer.save()

            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.http import HttpResponse
from django.db import connection

@csrf_exempt
def login_view(request):
    email = request.POST['email']
    password = request.POST['password']

    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", [email, password])
    user = cursor.fetchone()

    if user:
        return HttpResponse("Connexion réussie")
    else:
        return HttpResponse("Erreur d'authentification")