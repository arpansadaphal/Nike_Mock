from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Products,Order, ProductCategory, OrderItem
from .serializers import ProductSerializer,UserSerializer, UserSerializerWithToken, OrderSerialzer, OrderItemSerialzer, ProductCategorySerializer,ProductsSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.conf import settings
import razorpay
import json 
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt,  ensure_csrf_cookie
import os
from datetime import datetime
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from django.utils import timezone
from datetime import timedelta
from django.db.models import Case, When, Value, BooleanField
from django.core.serializers.json import DjangoJSONEncoder
import logging
# @api_view(['GET'])
# def products(request):
#    products = Products.objects.all()
#    serializer = ProductSerializer(products, many=True)
#    return Response(serializer.data)

def health_check(request):
    return JsonResponse({"status": "ok"})

@api_view(['GET'])
def products(request):
    # Retrieve query parameters
    gender = request.query_params.get('gender')
    category = request.query_params.get('category')
    price_min = request.query_params.get('min_price')
    price_max = request.query_params.get('max_price')
    new_arrivals = request.query_params.get('new_arrivals')
    pricelowtohigh = request.query_params.get('pricelowtohigh')
    pricehightolow = request.query_params.get('pricehightolow')
    # Get all products
    products = Products.objects.all()
    # Apply filters
    if gender:
        products = products.filter(gender=gender)
    if category:
        products = products.filter(productcategory__slug=category)
    if price_min:
        products = products.filter(price__gte=int(price_min))
    if price_max:
        products = products.filter(price__lte=int(price_max))
    if pricelowtohigh == 'true':
        products = products.order_by('price')
    if pricehightolow == 'true':
        products = products.order_by('-price')

    # Handle "new_arrivals" filter: Get the last 15 products added
    if new_arrivals == 'true':  
        last_15_ids = Products.objects.order_by('-_id')[:15].values_list('_id', flat=True)
        products = products.filter(_id__in=last_15_ids)

    # Annotate the queryset with a `is_new` flag
    last_15_ids = Products.objects.order_by('-_id')[:15].values_list('_id', flat=True)
    products = products.annotate(
        is_new=Case(
            When(_id__in=last_15_ids, then=Value(True)),
            default=Value(False),
            output_field=BooleanField(),
        )
    )

    # Serialize and return the data (no need to modify serializer, it handles main_image correctly)
    serializer = ProductsSerializer(products, many=True, context={'is_single_product': False})
    return Response(serializer.data)



@api_view(['GET'])
def new_products(request):
    products = Products.objects.order_by('-createdAt')[:8]
    # Annotate with `is_new`
    new_arrival_ids = Products.objects.order_by('-createdAt').values_list('_id', flat=True)[:15]
    products = products.annotate(
        is_new=Case(
            When(_id__in=new_arrival_ids, then=True),
            default=False,
            output_field=BooleanField()
        )
    )
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def mens_products(request):
    products = Products.objects.filter(gender='men')[:8]
    # Annotate with `is_new`
    new_arrival_ids = Products.objects.order_by('-createdAt').values_list('_id', flat=True)[:15]
    products = products.annotate(
        is_new=Case(
            When(_id__in=new_arrival_ids, then=True),
            default=False,
            output_field=BooleanField()
        )
    )
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def womens_products(request):
    products = Products.objects.filter(gender='women')[:8]
    # Annotate with `is_new`
    new_arrival_ids = Products.objects.order_by('-createdAt').values_list('_id', flat=True)[:15]
    products = products.annotate(
        is_new=Case(
            When(_id__in=new_arrival_ids, then=True),
            default=False,
            output_field=BooleanField()
        )
    )
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def kids_products(request):
    products = Products.objects.filter(gender='kids')[:8]
    # Annotate with `is_new`
    new_arrival_ids = Products.objects.order_by('-createdAt').values_list('_id', flat=True)[:15]
    products = products.annotate(
        is_new=Case(
            When(_id__in=new_arrival_ids, then=True),
            default=False,
            output_field=BooleanField()
        )
    )
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def product(request, id):
    product = Products.objects.get(_id=id)
    # Annotate with `is_new`
    new_arrival_ids = Products.objects.order_by('-createdAt').values_list('_id', flat=True)[:15]
    product = Products.objects.filter(_id=id).annotate(
        is_new=Case(
            When(_id__in=new_arrival_ids, then=True),
            default=False,
            output_field=BooleanField()
        )
    ).first()  # Use `.first()` to avoid conflicts
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def get_categories(request):
    categories = ProductCategory.objects.all()
    serializer = ProductCategorySerializer(categories, many=True)
    return Response(serializer.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer=UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k]=v       
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user=request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
   user=User.objects.all()
   serializer = UserSerializer(user, many=True)
   return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data= request.data
    print("Received data:", data)
    try:
        user=User.objects.create(
         first_name=data['fname'],
         last_name=data['lname'],username=data['email'],
         email=data['email'],
         password=make_password(data['password']))
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        message ={e}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
def filter_products(request):
    gender = request.GET.get('gender')
    category_slug = request.GET.get('category')
    price_min = request.GET.get('price_min', 0)
    price_max = request.GET.get('price_max', 10000)

    filters = {'is_active': True}

    if gender:
        filters['gender'] = gender
    if category_slug:
        filters['productcategory__slug'] = category_slug
    if price_min and price_max:
        filters['price__gte'] = price_min
        filters['price__lte'] = price_max

    products = Products.objects.filter(**filters).select_related('productcategory')
    results = [
        {
            "id": product.id,
            "productname": product.productname,
            "price": product.price,
            "gender": product.gender,
            "category": product.productcategory.name,
            "image": product.images.first().image.url if product.images.exists() else None,
        }
        for product in products
    ]

    return JsonResponse({'products': results})



@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})


@csrf_exempt
def create_razorpay_order(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Extract the Authorization header
        token = request.headers.get("Authorization", "").split("Bearer ")[-1]

        try:
            # Validate the access token
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            user = User.objects.get(id=user_id)
            print(user)
        except TokenError:
            return JsonResponse({"error": "Invalid or expired token."}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        # Continue with order creation
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY, settings.RAZORPAY_SECRET))
            razorpay_order = client.order.create(
                {
                    "amount": data["totalPrice"] * 100,  # Amount in paise
                    "currency": "INR",
                    "payment_capture": 1,
                }
            )
            # print(payment_id)
            # Create the order
            order = Order.objects.create(
                user=user,
                total_price=data["totalPrice"],
                razorpay_order_id=razorpay_order["id"],
                shipping_details=data["shippingDetails"],
                payment_method=data.get("paymentMethod", "COD"),
                payment_id=None
            )
             # Update Razorpay order with notes (internal order ID)
            client.order.edit(
                razorpay_order["id"],
                data={
                    "notes": {
                        "internal_order_id": str(order.id),
                    }
                }
            )
           
            # Process cart items and add them to the order
            cart_items = data.get("cartItems", [])
            # print(cart_items)
            for item in cart_items:
                product = Products.objects.get(_id=item["product"])
                quantity = item["qty"]
                price = item["price"]

                # Create an OrderItem for each cart item
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=price,
                )

            return JsonResponse({
                "key_id": settings.RAZORPAY_KEY,
                "razorpay_order_id": razorpay_order["id"],
                "amount": data["totalPrice"] * 100,
                "currency": "INR",
            })

        except Products.DoesNotExist:
            return JsonResponse({"error": "One or more products do not exist."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def verify_payment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Validate data
            required_fields = ["razorpay_order_id", "razorpay_payment_id", "razorpay_signature"]
            if not all(field in data for field in required_fields):
                return JsonResponse({"status": "error", "message": "Missing required fields."}, status=400)

            # Verify Razorpay signature
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY, settings.RAZORPAY_SECRET))
            client.utility.verify_payment_signature({
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature'],
            })
            payment_details = client.payment.fetch(data['razorpay_payment_id'])
            # Update the order as paid
            order = Order.objects.get(razorpay_order_id=data["razorpay_order_id"])
            order.payment_method = payment_details["method"]
            order.is_paid = True
            order.order_status = "paid"
            order.paid_at = datetime.now()
            order.payment_id = data["razorpay_payment_id"]
            order.save()

            return JsonResponse({"status": "success", "message": "Payment verified successfully!"})

        except razorpay.errors.SignatureVerificationError as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
        except Order.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Order not found."}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)


@csrf_exempt
def get_order_details(request, order_id):
    if request.method == "GET":
        try:
            
            order = Order.objects.get(razorpay_order_id=order_id)
            
            
            order_items = OrderItem.objects.filter(order=order)
            
           
            items = [
                {
                    "id": item.id,
                   
                    "product_name": item.product.productname, 
                    "quantity": item.quantity, 
                    "price": item.price,  
                }
                for item in order_items
            ]
       
            return JsonResponse({
                "status": "success",
                "order": {
                    "id": order.id,
                    "razorpay_order_id": order.razorpay_order_id,
                    "payment_id": order.payment_id,
                    "user": order.user.username if order.user else "Guest",
                    "payment_method": order.payment_method,
                    "total_price": float(order.total_price),  #
                    "is_paid": order.is_paid,
                    "paid_at": order.paid_at.strftime("%Y-%m-%d %H:%M:%S") if order.paid_at else None,
                    "shipping_details": order.shipping_details,
                    "order_date": order.order_date.strftime("%Y-%m-%d %H:%M:%S"),
                    "order_status": order.order_status,
                    "items": items,  
                },
            }, encoder=DjangoJSONEncoder)
        except Order.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Order not found."}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    try:
        # Fetch orders for the authenticated user
        orders = Order.objects.filter(user=request.user).order_by("-order_date")
        print(orders)
        # Prepare serialized data
        data = [
            {
                'id': order.id,
                'order_date': order.order_date.strftime("%Y-%m-%d %H:%M:%S"),
                'shipping_details': order.shipping_details,
                'payment_method': order.payment_method,
                'total_price': float(order.total_price),
                'is_paid': order.is_paid,
                'paid_at': order.paid_at.strftime("%Y-%m-%d %H:%M:%S") if order.paid_at else None,
                'order_status': order.order_status,
                'razorpay_order_id': order.razorpay_order_id,
                # 'items': [
                #     {
                #         'id': item.id,
                #         'product_id': item.product.id,
                #         'product_name': item.product.productname,  # Assuming `productname` is a field
                #         'quantity': item.quantity,
                #         'price': float(item.price),
                #     }
                #     for item in OrderItem.objects.filter(order=order)
                # ]
            }
            for order in orders
        ]
        print(data)
        return JsonResponse({'orders': data}, safe=False, encoder=DjangoJSONEncoder)
        # return JsonResponse({'orders': "data"})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def initiate_refund(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            payment_id = data["payment_id"]
            amount = data.get("amount")  # Optional amount for partial refunds
           
            # Prepare payload for refund
            payload = {"amount": amount} if amount else {}

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY, settings.RAZORPAY_SECRET))
            refund = client.payment.refund(payment_id, payload)
          

            # Handle refund response (ensure it's a single object, not a list)
            if isinstance(refund, list):
                refund = refund[0]

            refund_status = refund.get("status")
            refund_payment_id = refund.get("payment_id")

            if not refund_status or not refund_payment_id:
                return JsonResponse({"error": "Missing refund data"}, status=400)

            # Fetch the order related to this payment
            try:
                order = Order.objects.get(payment_id=refund_payment_id)
            except Order.DoesNotExist:
                return JsonResponse({"error": "Order not found"}, status=404)

            # Update the order status based on the refund
            order.order_status = "Refunded" if refund_status == "processed" else "Pending"
            order.save()

            return JsonResponse({
                "success": True,
                "refund": refund,
                "message": "Refund processed successfully." if refund_status == "processed" else "Refund initiated."
            }, status=200)

        except razorpay.errors.ServerError as e:
          
            return JsonResponse({"error": "Razorpay server error", "details": str(e)}, status=500)
        except Exception as e:
           
            return JsonResponse({"error": "An error occurred", "details": str(e)}, status=500)

    return JsonResponse({"error": "Invalid method"}, status=405)



