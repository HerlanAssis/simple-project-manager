import graphene
from graphene_django.types import DjangoObjectType
from ..models import Watcher, History

class WatcherType(DjangoObjectType):
  notification = graphene.Field(graphene.String, source='notification')
  class Meta:
    model = Watcher


class HistoryType(DjangoObjectType):
  class Meta:
    model = History