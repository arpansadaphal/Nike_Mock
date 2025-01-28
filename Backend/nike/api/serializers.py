from rest_framework import serializers
from .models import Products, ProductImage, ProductVariant, Review, Order, OrderItem, ProductCategory
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main']

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'stock_count']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Display the username

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']

class ProductsSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    productcategory = serializers.CharField(source='productcategory.name', read_only=True)
    main_image = serializers.SerializerMethodField()
    is_new = serializers.BooleanField() 
    class Meta:
        model = Products
        fields = ['_id', 'productname', 'productbrand', 'productcategory', 'price', 'main_image', 'variants','is_new','reviews']
    def get_main_image(self, obj):
        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            return main_image.image.url
        return None  # Return a placeholder or default image if no main image is set 
    
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    productcategory = serializers.CharField(source='productcategory.name', read_only=True)
    main_image = serializers.SerializerMethodField()
    is_new = serializers.BooleanField() 
    class Meta:
        model = Products
        fields = '__all__'
    
    def get_main_image(self, obj):
        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            return main_image.image.url
        return None  # Return a placeholder or default image if no main image is set 



class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class OrderSerialzer(serializers.ModelSerializer):
   class Meta:
       model=Order
       fields='__all__'
       
class OrderItemSerialzer(serializers.ModelSerializer):
   class Meta:
       model=OrderItem
       fields='__all__'



class UserSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField(read_only=True)
    _id=serializers.SerializerMethodField(read_only=True)
    isAdmin=serializers.SerializerMethodField(read_only=True)
   
    class Meta:
        model=User
        fields=['id','_id','username','email','name','isAdmin']
    
    def get_name(self,obj):
        firstname=obj.first_name
        lastname=obj.last_name
        name=firstname+' '+lastname
        if name=='':
            name=obj.email[:5]
            return name
        return name
    
    def get__id(self,obj):
        return obj.id

    def get_isAdmin(self,obj):
        return obj.is_staff
    
    
class UserSerializerWithToken(UserSerializer):
    token=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields=['id','_id','username','email','name','isAdmin','token']
    
    def get_token(self,obj):
        token=RefreshToken.for_user(obj)
        return str(token.access_token)

    
