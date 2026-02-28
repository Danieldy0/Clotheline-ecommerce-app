from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import EmailValidator

class AdminUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, password, **extra_fields)

class Admin(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    password = models.CharField(max_length=128) # Hashed password stores are longer
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    SUPER_ADMIN = 'SUPER_ADMIN'
    MANAGER = 'MANAGER'
    EDITOR = 'EDITOR'
    VIEWER = 'VIEWER'
    
    ROLE_CHOICES = [
        (SUPER_ADMIN, 'Super Admin'),
        (MANAGER, 'Manager'),
        (EDITOR, 'Editor'),
        (VIEWER, 'Viewer'),
    ]
    
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default=VIEWER,
        help_text='The role/type of this admin user.'
    )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='admin_groups',
        blank=True,
        help_text='The groups this admin user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='admin_user_permissions',
        blank=True,
        help_text='Specific permissions for this admin user.',
        verbose_name='user permissions',
    )
    
    objects = AdminUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name} ({self.email})"

    class Meta:
        verbose_name = 'Admin'
        verbose_name_plural = 'Admins'
    
