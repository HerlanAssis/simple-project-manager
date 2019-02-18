from django.urls import path, include
from apps import api
from .views import User, Repos

urlpatterns = [
    path('user/', User.as_view()),
    path('user/repos/', Repos.as_view()),
]
