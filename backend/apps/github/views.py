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

            cache.set('github_projects', github_projects, settings.CACHE_LEVEL['THREE'])

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

        # # Converter a lista para json
        # raw_contributors = [
        #     contributor.raw_data for contributor in contributors]

        # Eliminar os elementos repetidos
        unique_contributors = list(
            {contributor['id']: contributor for contributor in contributors}.values())

        # Iterar sobre todos os repositórios
        for project in projects:
            # Iterar sobre cada contribuidor em cada projeto
            for contributor in project['contributors']:
                # Iterar sobre todos os contribuidores únicos
                for unique_contributor in contributors:
                    # Caso o contribuidor (que agora é unico) faça parte deste projecto, adiciona-lo
                    # a lista de reposítorios deste contribuidor
                    if unique_contributor['id'] == contributor['id']:
                        # Cria uma nova lista caso seja vazio ou adiciona um novo elemento
                        print(project['repo'])
                        unique_contributor.setdefault(
                            'repos', []).append(project['repo'])

        return Response(unique_contributors)


class Limits(GithubAPIView):
    def get(self, request, format=None):
        limits = self.get_github_instance(request).get_rate_limit()

        return Response(limits)
