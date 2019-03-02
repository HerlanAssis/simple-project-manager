from django.urls import path, include
from .views import User, Projects, Contributors, Limits, Lab

urlpatterns = [
    path('user/', User.as_view()),
    path('projects/', Projects.as_view()),
    path('contributors/', Contributors.as_view()),
    path('limits/', Limits.as_view()),
    path('lab/', Lab.as_view()),    
]
