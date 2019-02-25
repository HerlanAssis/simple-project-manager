from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from github import Github
from django.core.cache import cache, caches


CACHE_LEVEL = {
    'ONE': 60,  # 1 minuto
    'TWO': 60 * 5,  # 5 minutos
    'THREE': 60 * 60,  # 1 hora
    'FOUR': 60 * 60 * 5,  # 5 horas
    'FIVE': 60 * 60 * 24,  # um dia
}


class GithubAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def github(self, request):
        access_token = request.user.social_auth.get(
            provider='github').extra_data['access_token']
        return Github(access_token)


class OverView(GithubAPIView):
    def get(self, request, format=None):                        
        return Response(self.github(request).get_rate_limit().raw_data)


class User(GithubAPIView):
    def get(self, request, format=None):
        cached_user = cache.get('user')

        if not cached_user:
            cached_user = self.github(request).get_user()
            cache.set('user', cached_user, CACHE_LEVEL['THREE'])

        return Response(cached_user.raw_data)


class Repos(GithubAPIView):
    def get(self, request, format=None):
        repos = []
        cached_repos = cache.get(key='repos', default=[])

        if not cached_repos:
            cached_repos = self.github(request).get_user().get_repos()
            cache.set('repos', cached_repos, CACHE_LEVEL['THREE'])

        # Then play with your Github objects:
        for repo in cached_repos:
            repos.append(repo.raw_data)

        return Response(repos)


class Contributors(GithubAPIView):
    def get(self, request, format=None):
        cached_repos = cache.get(key='repos', default=[])
        cached_contributors = cache.get(key='contributors', default=[])

        if not cached_repos:
            cached_repos = self.github(request).get_user().get_repos()
            cache.set('repos', cached_repos, CACHE_LEVEL['THREE'])

        if not cached_contributors:
            for repo in cached_repos:
                for contributor in repo.get_contributors():
                    cached_contributors.append(contributor.raw_data)
                    cache.set('contributors', cached_contributors,
                              CACHE_LEVEL['THREE'])

        # return a colection of unique colaborators
        unique_colaborators = {}
        try:
            unique_colaborators = list(
                {v['id']: v for v in cached_contributors}.values())
        except:
            pass

        return Response(unique_colaborators)
