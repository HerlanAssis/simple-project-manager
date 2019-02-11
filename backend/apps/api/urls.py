from django.urls import path, include
from .views import PrivateGraphQLView

urlpatterns = [
    # some other urls
    path('auth/', include('rest_framework_social_oauth2.urls')),
    path('graphql', PrivateGraphQLView.as_view(graphiql=True)),
    path('login/', include('rest_social_auth.urls_jwt')),
    path('login/', include('rest_social_auth.urls_token')),
    path('login/', include('rest_social_auth.urls_session')),
]
