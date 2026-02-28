from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Admin

@admin.register(Admin)
class AdminAccountAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'role', 'is_staff', 'is_active', 'last_login')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'name')
    ordering = ('email',)
    
    # UserAdmin needs fieldsets if you want a nice layout
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'role', 'password'),
        }),
    )
    filter_horizontal = ('groups', 'user_permissions')
