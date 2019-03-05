from django.urls import path, include
from .views import PrivateGraphQLView

urlpatterns = [
    # some other urls
    path('login/', include('rest_social_auth.urls_token')),
    path('pm/', include('apps.project_manager.urls')),
    path('c/', include('apps.client.urls')),
    # path('graphql', PrivateGraphQLView.as_view(graphiql=True)),
]
