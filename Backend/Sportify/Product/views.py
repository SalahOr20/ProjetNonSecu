from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Product, Order, OrderItem
from .serializer import ProductSerializer, OrderSerializer, OrderItemSerializer


# Créer un produit
@api_view(['POST'])
def create_product(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Obtenir la liste des produits
from django.shortcuts import render
from .models import Product

def product_list(request):
    products = Product.objects.all()
    html = "<h1>Liste des Produits</h1><ul>"

    for product in products:
        html += f"<li>{product.name}: {product.description}</li>"  # Vulnérable à XSS

    html += "</ul>"
    return HttpResponse(html)


# Obtenir un produit spécifique
@api_view(['GET'])
def get_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

# Mettre à jour un produit
@api_view(['PUT'])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

# Supprimer un produit
@api_view(['DELETE'])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response({'message': 'Product deleted'}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_order(request):
    user = request.user
    product_ids = request.data.get('product_ids', [])
    quantities = request.data.get('quantities', [])

    if not product_ids or not quantities or len(product_ids) != len(quantities):
        return Response({"error": "Invalid product data"}, status=status.HTTP_400_BAD_REQUEST)

    # Créer la commande
    order = Order.objects.create(user=user)

    # Ajouter les produits à la commande
    for product_id, quantity in zip(product_ids, quantities):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": f"Product with id {product_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        order_item = OrderItem.objects.create(
            order=order,
            product=product,
            quantity=quantity
        )

    order.calculate_total()

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


def get_order(request, order_id):
    order = Order.objects.get(id=order_id)
    data = {
        "id": order.id,
        "user": order.user.id,
        "total_price": str(order.total_price),
        "created_at": order.created_at,
        "is_paid": order.is_paid
    }
    return JsonResponse(data)