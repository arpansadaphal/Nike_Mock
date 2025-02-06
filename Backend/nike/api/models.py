from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField


# Product Category Model
class ProductCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)
    description = models.TextField(blank=True, null=True)
    # image = models.FileField(upload_to='categories/', validators=[validate_image_file_extension], null=True, blank=True)
    image = models.ImageField(upload_to='product_images/')
    
    def __str__(self):
        return self.name

class Products(models.Model):
    GENDER_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('unisex', 'Unisex'),
        ('kids', 'Kids'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    productname = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    productbrand = models.CharField(max_length=100, null=True, blank=True)
    productcategory = models.ForeignKey(ProductCategory, related_name='products', on_delete=models.CASCADE)
    productinfo = models.TextField()
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)  # Base price (optional)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisex')  # General product category
    createdAt = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.productname)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.productname


class ProductImage(models.Model):
    product = models.ForeignKey('Products', on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')
    is_main = models.BooleanField(default=False)  # To identify the main image

    def __str__(self):
        return f"{self.product.productname} Image"

"""
 

class ProductCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)
    description = models.TextField(blank=True, null=True)
    image = CloudinaryField('image', null=True, blank=True)  # ✅ Use CloudinaryField

    def __str__(self):
        return self.name

class Products(models.Model):
    GENDER_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('unisex', 'Unisex'),
        ('kids', 'Kids'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    productname = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    productbrand = models.CharField(max_length=100, null=True, blank=True)
    productcategory = models.ForeignKey(ProductCategory, related_name='products', on_delete=models.CASCADE)
    productinfo = models.TextField()
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisex')
    createdAt = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.productname)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.productname

class ProductImage(models.Model):
    product = models.ForeignKey('Products', on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image')  # ✅ Use CloudinaryField
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product.productname} Image"

"""

class ProductVariant(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=10)  # Example: S, M, L, XL
    color = models.CharField(max_length=50)  # Example: Red, Blue, Black
    stock_count = models.IntegerField(default=0)  # Number of items in stock
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)  # Price for this variant

    def __str__(self):
        return f"{self.product.productname} - {self.size}/{self.color}"


class Review(models.Model):
    product = models.ForeignKey('Products', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1)  # Rating out of 5 (e.g., 4.5)
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.productname} ({self.rating})"





class Order(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    order_date = models.DateTimeField(auto_now_add=True)
    shipping_details = models.JSONField()  # Stores name, address, city, etc.
    payment_method = models.CharField(max_length=50)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    order_status = models.CharField(max_length=20, default='Pending')
    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)  
    payment_id = models.CharField(max_length=100, null=True, blank=True)  

    def __str__(self):
        return f"Order {self.id} by {self.user.username if self.user else 'Guest'}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} of {self.product.productname}"

