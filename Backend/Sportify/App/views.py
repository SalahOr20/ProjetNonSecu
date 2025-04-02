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
@api_view(['POST'])
def create_product(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



def product_list(request):
    products = Product.objects.all()
    html = "<h1>Liste des Produits</h1><ul>"

    for product in products:
        html += f"""
            <li>
              <a href="/product/{product.id}">
                {product.name}
              </a>: {product.description}
            </li>
        """

    html += "</ul>"
    return HttpResponse(html)
def product_detail(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    html = f"""
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Prix : {product.price} €</p>
        <form method="post" action="/api/products/{product.id}/order/">
            <label>Quantité :
              <input type="number" name="quantity" value="1" min="1" />
            </label><br />
            <button type="submit">Commander</button>
        </form>
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
def order_product(request, product_id):
    if request.method == "POST":
        quantity = request.POST.get("quantity")
        product = get_object_or_404(Product, pk=product_id)

        # ici tu peux enregistrer une commande dans un modèle "Order" si tu veux
        return HttpResponse(f"<h2>Commande reçue pour {quantity} x {product.name}</h2>")
    return HttpResponse("Méthode non autorisée", status=405)


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



@csrf_exempt  # Disable CSRF protection
def login_view(request):
    if request.method == "POST":

        try:
            data = json.loads(request.body)  # Read JSON data sent
            email = data.get('email')
            password = data.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)

        # Directly checking email and password in the database (without hashing)
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM app_customuser WHERE email = %s AND password = %s", [email, password])
        user = cursor.fetchone()

        if user:
            # Return user data directly (id, email, username)
            return JsonResponse({
                'message': 'Login successful',
                'user': {
                    'id': user[0],       # Assuming 'id' is the first column
                    'email': user[2],    # Assuming 'email' is the second column
                    'username': user[3], # Assuming 'username' is the third column
                }
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
