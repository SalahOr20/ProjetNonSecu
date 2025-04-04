from django.urls import path
from . import views
from .views import login_view, register_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('<int:product_id>/', views.get_product, name='get_product'),
    path('create-order/', views.create_order, name='create_order'),
    path('my-orders/', views.get_orders, name='get_orders'),

    # Produits en HTML (avec XSS possible)
    path('products/', views.product_list),  # HTML avec <script>
    path('product/<int:product_id>/', views.product_detail),



    # 🔓 Commandes visibles pour tout le monde (IDOR)
    path('order/', views.order_list, name='order_list'),  # liste des commandes
    path('order/<int:order_id>/', views.order_detail, name='order_detail'),  # détail d'une commande
]
