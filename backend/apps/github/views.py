from github import Github
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.utils import encoders
from django.core.cache import cache
from django.conf import settings
from .utils import PyGithubJSONRenderer, manual_dump


class GithubAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (PyGithubJSONRenderer, )

    def get_github_instance(self, request):
        access_token = request.user.social_auth.get(
            provider='github').extra_data['access_token']
        return Github(access_token)

    def get_github_user_projects(self, request):
        github_projects = cache.get(key='github_projects', default=None)

        if not github_projects:
            user = self.get_github_instance(request).get_user()
            projects = []

            for repo in user.get_repos():
                contributors = [
                    contributor for contributor in repo.get_contributors()]
                projects.append({'repo': repo, 'contributors': contributors})

            github_projects = manual_dump({'user': user, 'projects': projects})

            cache.set('github_projects', github_projects,
                      settings.CACHE_LEVEL['THREE'])

        return github_projects


class User(GithubAPIView):
    def get(self, request, format=None):
        github_projects = self.get_github_user_projects(request)
        user = github_projects['user']
        return Response(user)


class Projects(GithubAPIView):
    def get(self, request, format=None):
        github_projects = self.get_github_user_projects(request)
        projects = github_projects['projects']

        return Response(projects)


class Contributors(GithubAPIView):
    def get(self, request, format=None):
        github_projects = self.get_github_user_projects(request)
        projects = github_projects['projects']
        contributors = []

        # Extrair a lista de contibuidores de cada repositório
        for project in projects:
            contributors += project['contributors']

        unique_contributor_dict = {
            contributor['id']: contributor for contributor in contributors}

        # Iterar sobre todos os repositórios
        for project in projects:
            # Iterar sobre cada contribuidor em cada projeto
            for contributor in project['contributors']:
                # acessar a chave única de cada contributor e adicionar o projecto equivalente a lista
                unique_contributor_dict[contributor['id']].setdefault(
                    'repos', []).append(project['repo'])

        # transformar o dicionario em uma lista
        unique_contributors = list(
            unique_contributor_dict.values())

        return Response(unique_contributors)


class Limits(GithubAPIView):
    def get(self, request, format=None):
        limits = self.get_github_instance(request).get_rate_limit()

        return Response(limits)


class Lab(GithubAPIView):
    _avaliable_comands = [
        {
            'name': 'Limpar Cache',
            'description': 'Este comando irá forar a atualização de todos os seus dados, use-o com cuidado!',
            'command': 'clean_cache'
        }
    ]

    def get(self, request, format=None):
        return Response(self._avaliable_comands)

    def post(self, request, format=None):
        cache.clear()
        return Response()
