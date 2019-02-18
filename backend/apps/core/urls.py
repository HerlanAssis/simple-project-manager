from django.urls import path, include
from apps import api
from .views import ExampleView

urlpatterns = [    
    path('', ExampleView.as_view()),    
]
