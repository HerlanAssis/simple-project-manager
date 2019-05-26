import graphene
from github import Github
from graphene_django.types import DjangoObjectType
from ..models import Watcher, History
from .types import WatcherType
from .inputs import WatcherInput
from apps.core.utils import get_or_none


class CreateWatcherAsGuest(graphene.Mutation):
    class Arguments:
        invitation_code = graphene.String(required=True)

    ok = graphene.Boolean()
    watcher = graphene.Field(WatcherType)

    @staticmethod
    def mutate(root, info, invitation_code, input=None):
        ok = False
        vigilant_instance = Watcher.getVigilantBy(
            invitation_code=invitation_code)

        if vigilant_instance:
            # invalidate invitation code
            vigilant_instance.resetInvitationCode()

            ok = True
            watcher_instance = Watcher(
                observer=info.context.user,
                vigilant=vigilant_instance,
            )

            watcher_instance.save()
            return CreateWatcherAsGuest(ok=ok, watcher=watcher_instance)
        return CreateWatcherAsGuest(ok=ok, watcher=None)


class CreateWatcherAsContributor(graphene.Mutation):
    class Arguments:
        project_id = graphene.String(required=True)
        reponame = graphene.String(required=True)

    ok = graphene.Boolean()
    watcher = graphene.Field(WatcherType)

    @staticmethod
    def mutate(root, info, project_id, reponame, input=None):
        ok = False

        # verificar se ele é um contribuidor
        try:
            access_token = info.context.user.social_auth.get(
                provider='github').extra_data['access_token']
            github_instance = Github(login_or_token=access_token)
            repo = github_instance.get_user().get_repo(reponame)

            if repo and repo.id != project_id:  # esse malandro não participa desse projeto
                return CreateWatcherAsContributor(ok=ok, watcher=None)
        except Exception as e:
            return CreateWatcherAsContributor(ok=ok, watcher=None)

        # segue o fluxo...

        vigilant_instance = Watcher.getVigilantBy(project_id=project_id)

        if vigilant_instance:
            ok = True
            watcher_instance = Watcher(
                observer=info.context.user,
                vigilant=vigilant_instance,
            )

            watcher_instance.save()
            return CreateWatcherAsContributor(ok=ok, watcher=watcher_instance)
        return CreateWatcherAsContributor(ok=ok, watcher=None)


class UpdateWatcher(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = WatcherInput(required=True)

    ok = graphene.Boolean()
    watcher = graphene.Field(WatcherType)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        watcher_instance = get_or_none(Watcher, pk=id)

        if watcher_instance:
            ok = True
            watcher_instance.notification = input.notification
            watcher_instance.save()
            return UpdateWatcher(ok=ok, watcher=watcher_instance)
        return UpdateWatcher(ok=ok, watcher=None)


class Mutation(graphene.ObjectType):
    create_Watcher_as_contributor = CreateWatcherAsContributor.Field()
    create_Watcher_as_guest = CreateWatcherAsGuest.Field()
    update_Watcher = UpdateWatcher.Field()
