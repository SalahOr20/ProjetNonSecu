from django.http import HttpResponse, JsonResponse
from rest_framework.generics import get_object_or_404
from .models import Product, Order, OrderItem, CustomUser
from .serializer import ProductSerializer, OrderSerializer, OrderItemSerializer, CustomUserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import connection

# Créer un produit



@csrf_exempt
def product_list(request):
    products = Product.objects.all()
    html = "<h1>Liste des Produits</h1><ul>"

    for product in products:
        html += f"""
            <li>
                <a href="/product/{product.id}">
                    {product.name}
                </a>: {product.description}
                <!-- Bouton retiré ou simple lien -->
            </li>
        """

    html += "</ul>"
    html += """
        <script>
            function showProduct(id) {
                alert('Produit ' + id);
            }
        </script>
    """
    return HttpResponse(html, content_type='text/html')

@csrf_exempt
def product_detail(request, product_id):
    product = Product.objects.get(id=product_id)
    html = f"""
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Prix: {product.price} €</p>
            <script>
                document.title = '{product.name}';
            </script>
        </div>
    """
    return HttpResponse(html)

# Obtenir un produit spécifique
@api_view(['GET'])
def get_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'App not found'}, status=status.HTTP_404_NOT_FOUND)



@csrf_exempt
def create_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        print("Request Data:", data)

        email_data = data.get('email')
        if not email_data:
            return JsonResponse({"error": "Email is required"}, status=400)

        email = email_data.get('email') if isinstance(email_data, dict) else email_data

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": f"User with email {email} not found"}, status=404)

        product_ids = data.get('product_ids', [])
        quantities = data.get('quantities', [])

        if not isinstance(product_ids, list) or not isinstance(quantities, list):
            return JsonResponse({"error": "'product_ids' and 'quantities' must be lists"}, status=400)

        if len(product_ids) != len(quantities):
            return JsonResponse({"error": "The number of products and quantities must match"}, status=400)

        # Créer la commande
        order = Order.objects.create(user=user)

        # Ajouter les articles à la commande
        for product_id, quantity in zip(product_ids, quantities):
            try:
                product = Product.objects.get(id=product_id)
                OrderItem.objects.create(order=order, product=product, quantity=quantity)
            except Product.DoesNotExist:
                return JsonResponse({"error": f"Product with id {product_id} not found"}, status=404)

        order.calculate_total()

        return JsonResponse({"message": "Order created successfully", "order_id": order.id}, status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@api_view(['GET'])
def get_orders(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    orders = Order.objects.filter(user=user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    print(serializer.data)
    return JsonResponse(serializer.data, safe=False)




@api_view(['POST'])
def register_view(request):
    data = request.data.copy()

    # On accepte et stocke les données telles quelles, sans hash du mot de passe
    serializer = CustomUserSerializer(data=data)

    if serializer.is_valid():
        user = serializer.save()  # Enregistre le mot de passe tel quel
        return Response({'message': 'Utilisateur enregistré sans sécurité.'}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt  # CSRF désactivé pour test uniquement
def login_view(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    # 🔓 Requête SQL volontairement vulnérable à l'injection
    raw_query = f"SELECT * FROM App_customuser WHERE email = '{email}' AND password = '{password}'"
    print("Executing raw query:", raw_query)

    cursor = connection.cursor()
    try:
        cursor.execute(raw_query)
        user = cursor.fetchone()
    except Exception as e:
        print("Erreur SQL :", e)
        return JsonResponse({'error': f'SQL Error: {str(e)}'}, status=500)

    if user:
        return JsonResponse({
            'message': 'Login successful',
            'user': {
                'id': user[0],
                'email': user[2],
                'username': user[3],
            }
        })
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

@csrf_exempt
def order_list(request):
    # Pas de vérification d'authentification
    orders = Order.objects.all()  # Montre TOUTES les commandes, pas seulement celles de l'utilisateur
    html = "<h1>Historique des commandes</h1><ul>"
    
    for order in orders:
        # IDOR: les IDs sont exposés et accessibles directement
        html += f"""
            <li>
                <a href="/order/{order.id}">Commande #{order.id}</a>
                (Total: {order.total} €)
            </li>
        """
    
    html += "</ul>"
    return HttpResponse(html)

@csrf_exempt
def order_detail(request, order_id):
    # IDOR: Pas de vérification que l'order appartient à l'utilisateur connecté
    try:
        order = Order.objects.get(id=order_id)
        html = f"""
            <h2>Détails de la commande #{order.id}</h2>
            <p>Client: {order.user.username}</p>
            <p>Email: {order.user.email}</p>
            <ul>
        """
        
        for item in order.items.all():
            html += f"""
                <li>{item.product.name} - Quantité: {item.quantity}</li>
            """
        
        html += "</ul>"
        return HttpResponse(html)
    except Order.DoesNotExist:
        return HttpResponse("Commande non trouvée", status=404)