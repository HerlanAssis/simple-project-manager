from django.urls import path, include
from .views import User, Projects, Contributors, Limits

urlpatterns = [
    path('user/', User.as_view()),
    path('projects/', Projects.as_view()),
    path('contributors/', Contributors.as_view()),
    path('limits/', Limits.as_view()),
]
