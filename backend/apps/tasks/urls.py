from django.urls import path, include
from .views import graphql, graphql

urlpatterns = [
    # path('telegrambot/', telegram.MeninoDeRecadoBot.as_view()),
    path('graphql', graphql.PrivateGraphQLView.as_view(graphiql=True)),
]
