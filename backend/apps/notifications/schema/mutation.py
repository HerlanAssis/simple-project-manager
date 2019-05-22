import graphene
from graphene_django.types import DjangoObjectType
from ..models import Watcher, History
from .types import WatcherType
from .inputs import WatcherInput

class CreateWatcher(graphene.Mutation):
  class Arguments:
    invitation_code=graphene.String(required=False)
    project_id=graphene.String(required=False)

  ok = graphene.Boolean()
  watcher = graphene.Field(WatcherType)

  @staticmethod
  def mutate(root, info, invitation_code, project_id, input=None):
    ok = False
    vigilant_instance = Watcher.getVigilantBy(invitation_code, project_id)

    if vigilant_instance:
      # invalidate invitation code
      vigilant_instance.resetInvitationCode()
      
      ok = True
      watcher_instance = Watcher(
        observer=info.context.user,      
        vigilant=vigilant_instance,
      )

      watcher_instance.save()
      return CreateWatcher(ok=ok, watcher=watcher_instance)
    return CreateWatcher(ok=ok, watcher=None)


class UpdateWatcher(graphene.Mutation):
  class Arguments:
    id = graphene.Int(required=True)
    input = WatcherInput(required=True)

  ok = graphene.Boolean()
  watcher = graphene.Field(WatcherType)

  @staticmethod
  def mutate(root, info, id, input=None):
    ok = False
    watcher_instance = Watcher.objects.get(pk=id)
    if watcher_instance:
      ok = True      
      watcher_instance.notification=input.notification
      watcher_instance.save()
      return UpdateWatcher(ok=ok, watcher=watcher_instance)
    return UpdateWatcher(ok=ok, watcher=None)


class Mutation(graphene.ObjectType):
  create_Watcher = CreateWatcher.Field()
  update_Watcher = UpdateWatcher.Field()