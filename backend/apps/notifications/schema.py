import graphene
from graphene_django.types import DjangoObjectType
from .models import Watcher, History


class WatcherType(DjangoObjectType):
  class Meta:
    model = Watcher


class HistoryType(DjangoObjectType):
  class Meta:
      model = History


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

class HistoryInput(graphene.InputObjectType):  
  id = graphene.ID()
  created_at = graphene.types.datetime.DateTime()
  updated_at = graphene.types.datetime.DateTime()
  # title = graphene.String()
  # year = graphene.Int()
  # actors = graphene.List(ActorInput)

class UpdateHistory(graphene.Mutation):  
  class Arguments:
    id = graphene.Int(required=True)
    input = HistoryInput(required=True)

  ok = graphene.Boolean()
  history = graphene.Field(HistoryType)

  @staticmethod
  def mutate(root, info, id, input=None):
    ok = False
    history_instance = History.objects.get(pk=id)

    print(history_instance)
    # if history_instance:
    #     ok = True
    #     actors = []
    #     for actor_input in input.actors:
    #       actor = Actor.objects.get(pk=actor_input.id)
    #       if actor is None:
    #         return UpdateHistory(ok=False, movie=None)
    #       actors.append(actor)
    #     history_instance.title=input.title
    #     history_instance.year=input.yearce.save()
    #     history_instance.actors.set(actors)
    #     return UpdateHistory(ok=ok, movie=history_instance)
    return UpdateHistory(ok=ok, history=None)

class Mutation(graphene.ObjectType):  
  pass
  update_history = UpdateHistory.Field()
  # create_actor = CreateActor.Field()
  # update_actor = UpdateActor.Field()
  # create_movie = CreateMovie.Field()
  # update_movie = UpdateMovie.Field()