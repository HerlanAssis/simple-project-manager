import graphene
from ..models import Watcher, History
from .types import WatcherType, HistoryType

class Query(object):
  all_Watchers = graphene.List(WatcherType)
  watcher = graphene.Field(WatcherType, id=graphene.Int(), authorization_code=graphene.String())

  all_historys = graphene.List(HistoryType)  
  history = graphene.Field(HistoryType, id=graphene.Int())

  def resolve_all_Watchers(self, info, **kwargs):
    return Watcher.objects.all()

  def resolve_watcher(self, info, **kwargs):
    id = kwargs.get('id')
    authorization_code = kwargs.get('authorization_code')

    if id is not None:
      return Watcher.objects.get(pk=id)

    if authorization_code is not None:
      return Watcher.objects.get(authorization_code=authorization_code)

    return None

  def resolve_all_historys(self, info, **kwargs):
    return History.objects.all()

  def resolve_history(self, info, **kwargs):
    id = kwargs.get('id')    

    if id is not None:
      return History.objects.get(pk=id)    

    return None