from math import ceil
from github import Github
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.utils import encoders
from django.core.cache import cache
from django.conf import settings
from apps.core.serializers import CurrentUserSerializer
from ..utils import PyGithubJSONRenderer, manual_dump


class GithubAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (PyGithubJSONRenderer, )
    per_page = 10

    def get_github_instance(self, request):
        access_token = request.user.social_auth.get(
            provider='github').extra_data['access_token']
        return Github(login_or_token=access_token, per_page=self.per_page)

    def get_paginated_github_object(self, data, page, cache_key, object_modeler):                                
        page_limit = ceil(data.totalCount/self.per_page) -1        

        next_page = prev_page = page
        if(next_page < page_limit):
            next_page += 1
        if(prev_page > 0):
            prev_page -= 1        

        current_page = cache.get(key=cache_key, default=None)

        if current_page is None:            
            current_page = object_modeler(data.get_page(page))
            cache.set(cache_key, current_page, settings.CACHE_LEVEL['THREE'])            

        return {
            'next': next_page,
            'previous': prev_page,
            'limit': page_limit,
            'current_page':current_page
        }


# class GithubPaginatedView(GithubAPIView):
#     pagination_class = pagination.PageNumberPagination
    
#     def get_paginated_response(self, data):
#         return Response({
#             'next': None,
#             'previous': None,
#             'count': len(data),
#             'results': data
#         })
    # def get_github_user_projects(self, request):
    #     github_projects = cache.get(key='github_projects', default=None)

    #     if not github_projects:
    #         user = self.get_github_instance(request).get_user()
    #         projects = []

    #         # commits = repo.get_commits()
    #         # commits_sha_list = []
    #         # for commit in commits:
    #         # 	commits_sha_list.append(commit.sha)

    #         # #Get a single commit by its sha
    #         # commit = repo.get_commit(commits_sha_list[0])

    #         for repo in user.get_repos():
    #             contributors = [
    #                 contributor for contributor in repo.get_contributors()]
    #             # sha_commits = [commit for commit in repo.get_commits()]
    #             # commits = [repo.get_commit(commit.sha)
    #             #            for commit in sha_commits]

    #             projects.append(
    #                 {'repo': repo, 'contributors': contributors})

    #         github_projects = manual_dump({'user': user, 'projects': projects})

    #         cache.set('github_projects', github_projects,
    #                   settings.CACHE_LEVEL['THREE'])

    #     return github_projects


class User(GithubAPIView):
    def get(self, request, format=None):
        user = CurrentUserSerializer(request.user).data
        return Response(user)


# class Projects(GithubAPIView):
#     def get(self, request, format=None):
#         github_projects = self.get_github_user_projects(request)
#         # projects = github_projects['projects']

#         return Response('')


class Repos(GithubAPIView):
    def get(self, request, format=None):
        user = self.get_github_instance(request).get_user()
        repos = user.get_repos()
        page = request.GET.get('page')

        if page is None:
            page = 0
        
        cache_key = 'repos-page-{}'.format(page)        

        object_modeler = lambda data: [{'name': repo.name, 'id': repo.id} for repo in data]

        content = self.get_paginated_github_object(repos, page, cache_key, object_modeler)

        return Response(content)        


class Contributors(GithubAPIView):
    def get(self, request, reponame, format=None):
        user = self.get_github_instance(request).get_user()
        repo = user.get_repo(reponame)
        key = 'contributors-{}'.format(repo.name)
        contributors = cache.get(key=key, default=[])

        if not contributors:
            contributors = [contributor for contributor in repo.get_contributors()]
            cache.set(key, contributors, settings.CACHE_LEVEL['THREE'])

        return Response(contributors)
        # github_projects = self.get_github_user_projects(request)
        # projects = github_projects['projects']
        # contributors = []

        # # Extrair a lista de contibuidores de cada repositório
        # for project in projects:
        #     contributors += project['contributors']

        # unique_contributor_dict = {
        #     contributor['id']: contributor for contributor in contributors}

        # # Iterar sobre todos os repositórios
        # for project in projects:
        #     # Iterar sobre cada contribuidor em cada projeto
        #     for contributor in project['contributors']:
        #         # acessar a chave única de cada contributor e adicionar o projecto equivalente a lista
        #         unique_contributor_dict[contributor['id']].setdefault(
        #             'repos', []).append(project['repo'])

        # # transformar o dicionario em uma lista
        # unique_contributors = list(
        #     unique_contributor_dict.values())

        # return Response(unique_contributors)


class Limits(GithubAPIView):
    def get(self, request, format=None):
        limits = self.get_github_instance(request).get_rate_limit()

        return Response(limits)


class Commits(GithubAPIView):
    def get(self, request, reponame, format=None):
        user = self.get_github_instance(request).get_user()
        repo = user.get_repo(reponame)

        key = 'commits-{}'.format(repo.name)

        commits = cache.get(
            key='commits-{}'.format(repo.name), default=None)

        if not commits:
            # Get commits to a repo
            commits = [commit for commit in repo.get_commits()]

            commits_dumped = manual_dump(commits)

            cache.set('commits-{reponame}'.format(reponame=repo.name), commits_dumped,
                      settings.CACHE_LEVEL['THREE'])

        return Response(commits)


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
