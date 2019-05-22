import graphene
from graphene_django.types import DjangoObjectType
from ..models import Watcher, History
from .types import WatcherType
from .inputs import WatcherInput

class CreateWatcher(graphene.Mutation):
  class Arguments:
    input = WatcherInput(required=True)

  ok = graphene.Boolean()

  @staticmethod
  def mutate(root, info, input=None):
    ok = True    
    watcher_instance = Watcher(
      observer=info.context.user,
      notification=input.notification,
      vigilant=input.vigilant,
    )
    # watcher_instance.save()
    return CreateWatcher(ok=ok, watcher=watcher_instance)


class Mutation(graphene.ObjectType):
  create_Watcher = CreateWatcher.Field()
  # update_Watcher = UpdateWatcher.Field()