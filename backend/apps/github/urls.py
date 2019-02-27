from django.urls import path, include
from apps import api
from .views import User, Repos, Contributors, OverView, Home

urlpatterns = [
    path('', OverView.as_view()),
    path('teste/', Home.as_view()),
    path('user/', User.as_view()),
    path('repos/', Repos.as_view()),
    path('contributors/', Contributors.as_view()),    
]
