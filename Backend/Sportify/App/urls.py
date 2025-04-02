from django.urls import path
from . import views
from .views import login_view, register_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('create/', views.create_product, name='create_product'),
    path('<int:product_id>/', views.get_product, name='get_product'),
    path('create-order/', views.create_order, name='create_order'),
    path('my-orders/', views.get_orders, name='get_orders'),  # Renamed to avoid conflict
    path('', views.product_list),
    path('products/<int:product_id>/', views.product_detail),
    path('products/<int:product_id>/order/', views.order_product),
]
