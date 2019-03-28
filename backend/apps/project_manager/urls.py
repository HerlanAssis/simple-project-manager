from django.urls import path, include
from .views import github

urlpatterns = [
    path('user/', github.User.as_view()),
    path('repos/', github.Repos.as_view()),
    path('commits/', github.Commits.as_view()),
    path('watchers/', github.Watchers.as_view()),
    path('search/', github.SearchByRepositories.as_view()),
    path('contributors/', github.Contributors.as_view()),
    path('limits/', github.Limits.as_view()),
    path('lab/', github.Lab.as_view()),
]
