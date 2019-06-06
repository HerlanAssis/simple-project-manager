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
from rest_framework.settings import api_settings
from ..utils import PyGithubJSONRenderer, manual_dump
from apps.core.utils import generate_cache_key_by_user
# enable_console_debug_logging()


def repo_object_modeler(data, extra_args): return [
    {
        'name': repo.name, 'full_name': repo.full_name, 'id': repo.id,
        'num_contributors': repo.get_contributors().totalCount,
        'num_commits': repo.get_commits().totalCount, 'has_in_starred': extra_args['user'].has_in_starred(repo),'is_owner': extra_args['user'].id == repo.owner.id
    } for repo in data
]


class GithubAPIView(APIView):
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    permission_classes = (IsAuthenticated,)
    renderer_classes = (PyGithubJSONRenderer, )
    per_page = 10

    def get_github_instance(self, request):
        access_token = request.user.social_auth.get(
            provider='github').extra_data['access_token']
        return Github(login_or_token=access_token, per_page=self.per_page)

    def get_repo(self, request, repo_full_name):
        return self.get_github_instance(request).get_repo(repo_full_name)

    def get_paginated_github_object(self, request, data, page, key, object_modeler, extra_args):
        total_items = data.totalCount

        if page is None:
            page = 0

        cache_key = '{}-{}'.format(key, page)
        by_user_cache_key = generate_cache_key_by_user(request.user, cache_key)

        # pygithub pages api start from 0
        # page_limit = ceil(total_items/self.per_page) -1

        # prev_page = page
        # next_page = page
        # if(next_page < page_limit):
        #     next_page += 1
        # if(prev_page > 0):
        #     prev_page -= 1

        current_page = cache.get(key=by_user_cache_key, default=None)
        if current_page is None:
            current_page = manual_dump(
                object_modeler(data.get_page(int(page)), extra_args))
            cache.set(by_user_cache_key, current_page, settings.CACHE_LEVEL['THREE'])

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

        extra_args = {'user': user}

        content = self.get_paginated_github_object(request, 
            repos, page, key, repo_object_modeler, extra_args)

        return Response(content)


class Watchers(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        watchers = user.get_watched()
        page = request.GET.get('page')

        key = 'watchers-page'

        extra_args = {'user': user}

        content = self.get_paginated_github_object(request, 
            watchers, page, key, repo_object_modeler, extra_args)

        return Response(content)


class AddToWatched(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        repo_full_name = request.GET.get('repo_full_name')
        repo = self.get_repo(request, repo_full_name)
        user.add_to_watched(repo)

        content = {'status': 'ok'}

        # clean cache
        cache.clear()

        return Response(content)


class RemoveFromWatched(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        repo_full_name = request.GET.get('repo_full_name')
        repo = self.get_repo(request, repo_full_name)
        user.remove_from_watched(repo)

        content = {'status': 'ok'}

        # clean cache
        cache.clear()

        return Response(content)


class Stargazers(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        stargazers = user.get_starred()
        page = request.GET.get('page')

        key = 'stargazers-page'

        extra_args = {'user': user}

        content = self.get_paginated_github_object(request, 
            stargazers, page, key, repo_object_modeler, extra_args)

        return Response(content)


class AddToStargazer(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        repo_full_name = request.GET.get('repo_full_name')
        repo = self.get_repo(request, repo_full_name)
        user.add_to_starred(repo)

        content = {'status': 'ok'}

        # clean cache
        cache.clear()

        return Response(content)


class RemoveFromStargazers(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        repo_full_name = request.GET.get('repo_full_name')
        repo = self.get_repo(request, repo_full_name)
        user.remove_from_starred(repo)

        content = {'status': 'ok'}

        # clean cache
        cache.clear()

        return Response(content)


class SearchByRepositories(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        reponame = request.GET.get('reponame')
        page = request.GET.get('page')
        repos = self.get_github_instance(request).search_repositories(reponame)

        key = 'search-{}-page'.format(reponame)

        extra_args = {'user': user}

        content = self.get_paginated_github_object(request, 
            repos, page, key, repo_object_modeler, extra_args)

        return Response(content)


class Contributors(GithubAPIView):
    def get(self, request, format=None):
        repo_full_name = request.GET.get('repo_full_name')
        repo = self.get_repo(request, repo_full_name)
        # repo = self.get_repo(request, reponame)

        contributors = repo.get_contributors()
        page = request.GET.get('page')

        key = 'repo-{}-contributors-page'.format(repo_full_name)

        def object_modeler(data, extra_args): return [
            contributor for contributor in data]

        content = self.get_paginated_github_object(request, 
            contributors, page, key, object_modeler, None)

        return Response(content)


class Commits(GithubAPIView):
    def get(self, request, format=None):        
        repo_full_name = request.GET.get('repo_full_name')
        repo = self.get_repo(request, repo_full_name)        

        commits = repo.get_commits()
        page = request.GET.get('page')
        key = 'repo-{}-commit-page'.format(repo_full_name)

        def object_modeler(data, extra_args): return [
            {'commit': commit.commit, 'committer': commit.committer, 'stats': commit.stats} for commit in data]

        content = self.get_paginated_github_object(request, 
            commits, page, key, object_modeler, {})

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
