from django.urls import path, include
from apps import api
from .views import home

urlpatterns = [    
    path('', home),
    path('api/', include('apps.api.urls')),    
]
