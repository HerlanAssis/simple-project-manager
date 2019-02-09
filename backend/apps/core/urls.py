from django.urls import path
from .views import PrivateGraphQLView

urlpatterns = [
  # some other urls
  path('', PrivateGraphQLView.as_view(graphiql=True)),
]