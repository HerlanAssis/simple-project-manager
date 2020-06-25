import graphene
from graphene_django.types import DjangoObjectType
from ..models import Watcher, History
from django.contrib.auth.models import User

class ObserverType(DjangoObjectType):  
  class Meta:
    model = User


class WatcherType(DjangoObjectType):
  notification = graphene.Field(graphene.String, source='notification')
  class Meta:
    model = Watcher


class HistoryType(DjangoObjectType):
  sources = graphene.Field(graphene.String, source='sources')
  class Meta:
    model = History
