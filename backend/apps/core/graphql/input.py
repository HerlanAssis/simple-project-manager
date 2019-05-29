import graphene
from graphene_django.types import DjangoObjectType

class UserInput(graphene.InputObjectType):
  id = graphene.ID()
  username = graphene.String()
  email = graphene.String()
  first_name = graphene.String()