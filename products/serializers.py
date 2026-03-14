from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductVariantSerializer(serializers.ModelSerializer):
    price = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = ['id', 'color', 'size', 'stock', 'price_override', 'price']

class ProductSerializer(serializers.ModelSerializer):
    # Change these from read_only=True to allow creation
    images = ProductImageSerializer(many=True, required=False)
    variants = ProductVariantSerializer(many=True, required=False)
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'slug',
            'description', 'base_price', 'images', 'variants', 'created_at'
        ]
        # Use slug as the primary lookup for the product list
        lookup_field = 'slug'

    def create(self, validated_data):
        # Handle images and variants from request if using multipart/form-data
        request = self.context.get('request')
        
        # Pull standard nested data if it exists (JSON request)
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])
        
        # Handle FormData additions
        if request:
            # Handle variants from JSON string
            variants_json = request.data.get('variants_json')
            if variants_json:
                import json
                try:
                    variants_data = json.loads(variants_json)
                except (ValueError, TypeError):
                    pass
            
            # Handle multiple image files
            image_files = request.FILES.getlist('image_files')
            for image_file in image_files:
                images_data.append({'image': image_file})

        # Default slug if not provided
        if 'slug' not in validated_data or not validated_data['slug']:
            validated_data['slug'] = validated_data['name'].lower().replace(' ', '-')
            
        product = Product.objects.create(**validated_data)
        
        for image_item in images_data:
            ProductImage.objects.create(product=product, **image_item)
            
        for variant_item in variants_data:
            # Handle potential string stock/price from FormData
            if isinstance(variant_item.get('stock'), str):
                variant_item['stock'] = int(variant_item['stock']) if variant_item['stock'] else 0
            if variant_item.get('price_override') == '':
                variant_item['price_override'] = None
                
            ProductVariant.objects.create(product=product, **variant_item)
            
        return product

    def update(self, instance, validated_data):
        request = self.context.get('request')
        images_data = validated_data.pop('images', None)
        variants_data = validated_data.pop('variants', None)

        # Handle FormData additions
        if request:
            # Handle variants from JSON string
            variants_json = request.data.get('variants_json')
            if variants_json:
                import json
                try:
                    variants_data = json.loads(variants_json)
                except (ValueError, TypeError):
                    pass
            
            # Handle multiple image files
            image_files = request.FILES.getlist('image_files')
            if image_files:
                if images_data is None:
                    images_data = []
                for image_file in image_files:
                    images_data.append({'image': image_file})

        # Update core fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Simple replacement for images and variants if provided
        if images_data is not None:
            instance.images.all().delete()
            for image_item in images_data:
                ProductImage.objects.create(product=instance, **image_item)

        if variants_data is not None:
            instance.variants.all().delete()
            for variant_item in variants_data:
                # Handle potential string stock/price from FormData
                if isinstance(variant_item.get('stock'), str):
                    variant_item['stock'] = int(variant_item['stock']) if variant_item['stock'] else 0
                if variant_item.get('price_override') == '':
                    variant_item['price_override'] = None
                
                ProductVariant.objects.create(product=instance, **variant_item)

        return instance