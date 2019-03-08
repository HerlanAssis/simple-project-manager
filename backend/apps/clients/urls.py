from django.urls import path, include
from .views import User

urlpatterns = [
    path('user/', User.as_view()),    
]
