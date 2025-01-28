from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)

urlpatterns = [
   
    path("products/", views.products, name="products"),
    path("new_products/", views.new_products, name="new_products"),
    path("mens_products/", views.mens_products, name="mens_products"),    
    path("womens_products/", views.womens_products, name="womens_products"),    
    path("kids_products/", views.kids_products, name="kids_products"),    
    path("product/<str:id>", views.product, name="product"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/profile/', views.getUserProfile, name='getUserProfile'),
    path("users/",views.getUsers,name='getUsers'),
    path("users/register/",views.registerUser,name='registerUser'),
    path("create_razorpay_order/",views.create_razorpay_order,name='create_razorpay_order'),
    path("verify-payment/",views.verify_payment,name='verify_payment'),
    path("order/<str:order_id>/", views.get_order_details, name="order-details"),
    path("order_history/", views.order_history, name="order_history"),
    path('refund/', views.initiate_refund, name='initiate_refund'),
    path('get_csrf_token/', views.get_csrf_token),
    path('filter_products/', views.filter_products, name='filter-products'),
    path('categories/', views.get_categories, name='get-categories'),
]
