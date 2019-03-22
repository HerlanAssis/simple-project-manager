from math import ceil
from github import Github, enable_console_debug_logging
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.utils import encoders
from django.core.cache import cache
from django.conf import settings
from apps.core.serializers import CurrentUserSerializer
from ..utils import PyGithubJSONRenderer, manual_dump

# enable_console_debug_logging()


class GithubAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (PyGithubJSONRenderer, )
    per_page = 10

    def get_github_instance(self, request):
        access_token = request.user.social_auth.get(
            provider='github').extra_data['access_token']
        return Github(login_or_token=access_token, per_page=self.per_page)

    def get_repo(self, request, reponame):
        user = self.get_github_instance(request).get_user()
        repo = None

        try:
            repo = user.get_repo(reponame)
        except Exception as e:
            repos = user.get_repos()
            repo_id = int(request.GET.get('repo_id'))
            for user_repo in repos:
                if(user_repo.id == repo_id):
                    repo = user_repo

        return repo

    def get_paginated_github_object(self, data, page, key, object_modeler):
        total_items = data.totalCount

        if page is None:
            page = 0

        cache_key = '{}-{}'.format(key, page)

        # pygithub pages api start from 0
        # page_limit = ceil(total_items/self.per_page) -1

        # prev_page = page
        # next_page = page
        # if(next_page < page_limit):
        #     next_page += 1
        # if(prev_page > 0):
        #     prev_page -= 1

        current_page = cache.get(key=cache_key, default=None)

        if current_page is None:
            current_page = manual_dump(
                object_modeler(data.get_page(int(page))))
            cache.set(cache_key, current_page, settings.CACHE_LEVEL['THREE'])

        return {
            # 'next': next_page,
            # 'previous': prev_page,
            # 'limit': page_limit,
            'per_page': self.per_page,
            'total_itens': total_items,
            'current_page': page,
            'results': current_page
        }


class User(GithubAPIView):
    def get(self, request, format=None):
        user = CurrentUserSerializer(request.user).data
        return Response(user)


class Repos(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        repos = user.get_repos()
        page = request.GET.get('page')

        key = 'repos-page'

        def object_modeler(data): return [
            {'name': repo.name, 'full_name': repo.full_name, 'id': repo.id} for repo in data]
        content = self.get_paginated_github_object(
            repos, page, key, object_modeler)

        return Response(content)


class Contributors(GithubAPIView):
    def get(self, request, reponame, format=None):
        # user = self.get_github_instance(request).get_user()
        repo = self.get_repo(request, reponame)

        contributors = repo.get_contributors()
        page = request.GET.get('page')

        key = 'repo-{}-contributors-page'.format(reponame)

        def object_modeler(data): return [contributor for contributor in data]

        content = self.get_paginated_github_object(
            contributors, page, key, object_modeler)

        return Response(content)


class Commits(GithubAPIView):
    def get(self, request, reponame, format=None):
        # user = self.get_github_instance(request).get_user()
        repo = self.get_repo(request, reponame)

        commits = repo.get_commits()
        page = request.GET.get('page')
        key = 'repo-{}-commit-page'.format(reponame)

        def object_modeler(data): return [
            {'commit': commit.commit, 'committer': commit.committer, 'stats': commit.stats} for commit in data]

        content = self.get_paginated_github_object(
            commits, page, key, object_modeler)

        return Response(content)


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
        response = 'Comando não encontrado!'

        command = request.POST.get("command", "")
        if command == 'clean_cache':
            cache.clear()
            response = 'Comando executado com sucesso!'

        return Response(response)
