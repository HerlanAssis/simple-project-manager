from django.urls import path, include
from .views import github

urlpatterns = [
    path('user/', github.User.as_view()),
    path('projects/', github.Projects.as_view()),
    path('contributors/', github.Contributors.as_view()),
    path('limits/', github.Limits.as_view()),
    path('lab/', github.Lab.as_view()),    
]
