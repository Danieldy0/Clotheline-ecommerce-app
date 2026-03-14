from rest_framework import viewsets
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD for Categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class ProductViewSet(viewsets.ModelViewSet):
    """
    Streamlined CRUD for Products.
    Managing images and variants through the product endpoints.
    Uses slug for identification.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
