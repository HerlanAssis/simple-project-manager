import graphene
from graphene_django.types import DjangoObjectType
from ..models import Watcher, History

class WatcherType(DjangoObjectType):
  class Meta:
    model = Watcher


class HistoryType(DjangoObjectType):
  class Meta:
    model = History