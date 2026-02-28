from django.urls import path
from .views import AdminListCreateAPIView, AdminRetrieveUpdateDestroyAPIView, AdminLoginView

urlpatterns = [
    path('admins/', AdminListCreateAPIView.as_view(), name='admin-list-create'),
    path('admins/<int:pk>/', AdminRetrieveUpdateDestroyAPIView.as_view(), name='admin-detail'),
    path('login/', AdminLoginView.as_view(), name='admin-login'),
]