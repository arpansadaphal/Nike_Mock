from django.contrib import admin
from .models import Products,ProductCategory,ProductImage,ProductVariant,Review,Order,OrderItem
# admin.site.register(Products)
admin.site.register(ProductCategory)
# admin.site.register(ProductImage)
admin.site.register(ProductVariant)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)


# Inline for ProductImage
class ProductImageInline(admin.TabularInline):  # Or use StackedInline for a different style
    model = ProductImage
    extra = 1  # Number of empty forms to display
    fields = ('image', 'is_main')  # Display these fields in the inline form

# Admin for Products
@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('productname', 'productbrand', 'price', 'gender', 'is_active', 'createdAt')
    list_filter = ('gender', 'is_active', 'createdAt')
    search_fields = ('productname', 'productbrand')
    inlines = [ProductImageInline]  # Add the inline form here
