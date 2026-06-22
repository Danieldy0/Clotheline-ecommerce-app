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
    Uses slug for identification but falls back to ID if slug is missing or not found.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]
        
        # 1. Try slug first (if lookup_value is not empty)
        if lookup_value:
            try:
                return queryset.get(slug=lookup_value)
            except Product.DoesNotExist:
                pass
        
        # 2. Fallback to ID if lookup_value is numeric
        if lookup_value.isdigit() or not lookup_value:
            try:
                # If lookup_value is empty (like in item 1), we might need to use another source or handle it
                # But here we assume the URL part is the ID if slug lookup fails
                return queryset.get(id=lookup_value if lookup_value else self.request.query_params.get('id', 0))
            except (Product.DoesNotExist, ValueError):
                pass
                
        # 3. Final attempt using the default logic (will raise 404 if still not found)
        return super().get_object()
