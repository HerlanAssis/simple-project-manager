from django.contrib.auth.mixins import LoginRequiredMixin
from graphene_django.views import GraphQLView

# from rest_framework.authentication import TokenAuthentication, BasicAuthentication
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView    


# class PrivateGraphQLView(APIView, GraphQLView):
class PrivateGraphQLView(GraphQLView):
    # authentication_classes = (TokenAuthentication, BasicAuthentication)
    # permission_classes = (IsAuthenticated,)
    """Adds a login requirement to graphQL API access via main endpoint."""
    pass
