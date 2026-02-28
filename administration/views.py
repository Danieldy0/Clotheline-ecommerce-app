from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .models import Admin
from .serializers import AdminSerializer   

# List all admins or create a new admin
class AdminListCreateAPIView(generics.ListCreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

# Retrieve, update, or delete an admin
class AdminRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class AdminLoginView(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        password = request.query_params.get('password')
        
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = Admin.objects.get(email=email)
            if user.check_password(password):
                if not user.is_active:
                    return Response({'error': 'Account is disabled'}, status=status.HTTP_403_FORBIDDEN)
                
                serializer = AdminSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Admin.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
