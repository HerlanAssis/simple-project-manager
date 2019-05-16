from django.urls import path, include
from .views import telegram

urlpatterns = [
    path('telegrambot/', telegram.MeninoDeRecadoBot.as_view()),    
]
