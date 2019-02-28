from github import Github
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.utils import encoders
from django.core.cache import cache
from django.conf import settings
from .utils import PyGithubJSONRenderer, manual_dump


CACHE_LEVEL = settings.CACHE_LEVEL['THREE']


class GithubAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (PyGithubJSONRenderer, )

    def github(self, request):
        access_token = request.user.social_auth.get(
            provider='github').extra_data['access_token']
        return Github(access_token)

    def github_cache(self, request):

        github_cache = cache.get(key='github_cache', default=None)

        if not github_cache:
            user = self.github(request).get_user()
            projects = []

            for repo in user.get_repos():
                contributors = [
                    contributor for contributor in repo.get_contributors()]
                projects.append({'repo': repo, 'contributors': contributors})

            github_cache = manual_dump({'user': user, 'projects': projects})

            cache.set('github_cache', github_cache, CACHE_LEVEL)

        return github_cache


class User(GithubAPIView):
    def get(self, request, format=None):
        github_cache = self.github_cache(request)
        user = github_cache['user']
        return Response(user)


class Projects(GithubAPIView):
    def get(self, request, format=None):
        github_cache = self.github_cache(request)
        projects = github_cache['projects']

        return Response(projects)


class Contributors(GithubAPIView):
    def get(self, request, format=None):
        github_cache = self.github_cache(request)
        projects = github_cache['projects']
        contributors = []

        # Extrair a lista de contibuidores de cada repositório
        for project in projects:
            contributors += project['contributors']

        # # Converter a lista para json
        # raw_contributors = [
        #     contributor.raw_data for contributor in contributors]

        # Eliminar os elementos repetidos
        unique_contributors = list(
            {contributor['id']: contributor for contributor in contributors}.values())

        # Iterar sobre todos os repositórios
        for project in projects:
            # Iterar sobre todos os contribuidores únicos
            for unique_contributor in contributors:
                # Iterar sobre cada contribuidor em cada projeto
                for contributor in project['contributors']:
                    # Caso o contribuidor (que agora é unico) faça parte deste projecto, adiciona-lo
                    # a lista de reposítorios deste contribuidor
                    if unique_contributor['id'] == contributor['id']:
                        # Cria uma nova lista caso seja vazio ou adiciona um novo elemento
                        unique_contributor.setdefault(
                            'repos', []).append(project['repo'])

        return Response(unique_contributors)


class Limits(GithubAPIView):
    def get(self, request, format=None):
        limits = self.github(request).get_rate_limit()

        return Response(limits)
