from django.urls import path, include
from .views import PrivateGraphQLView

urlpatterns = [
    # some other urls
    path('login/', include('rest_social_auth.urls_token')),
    path('graphql', PrivateGraphQLView.as_view(graphiql=True)),
    path('github/', include('apps.github.urls')),
]
