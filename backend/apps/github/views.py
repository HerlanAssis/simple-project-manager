from rest_framework import renderers
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.utils import encoders
from django.core.cache import cache, caches
from github import Github, GithubObject


CACHE_LEVEL = {
    'ONE': 60,  # 1 minuto
    'TWO': 60 * 5,  # 5 minutos
    'THREE': 60 * 60,  # 1 hora
    'FOUR': 60 * 60 * 5,  # 5 horas
    'FIVE': 60 * 60 * 24,  # um dia
}


class ComplexEncoder(encoders.JSONEncoder):
    def default(self, obj):        
        if isinstance(obj, GithubObject.GithubObject):
            return obj.raw_data
        return super().default(obj)


class CustomJSONRenderer(renderers.JSONRenderer):
    encoder_class = ComplexEncoder 


class GithubAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (CustomJSONRenderer, )

    def github(self, request):
        access_token = request.user.social_auth.get(
            provider='github').extra_data['access_token']
        return Github(access_token)

    def user(self, request):
        user = cache.get('user', None)

        if not user:
            user = self.github(request).get_user()
            cache.set('user', user, CACHE_LEVEL['THREE'])
        return user

    def repos(self, request):
        repos = cache.get(key='repos', default=[])

        if not repos:
            repos = self.github(request).get_user().get_repos()
            cache.set('repos', repos, CACHE_LEVEL['THREE'])

        return repos

    def contributors(self, request):
        repos = self.repos(request)
        contributors = cache.get(key='contributors', default=[])

        if not contributors:
            for repo in repos:
                contributors += [
                    contributor for contributor in repo.get_contributors()]
            cache.set('contributors', contributors,
                      CACHE_LEVEL['THREE'])

        return contributors

    def limits(self, request):
        return self.github(request).get_rate_limit()


class OverView(GithubAPIView):
    def get(self, request, format=None):
        return Response(self.github(request).get_rate_limit().raw_data)


class User(GithubAPIView):
    def get(self, request, format=None):
        user = self.user(request)
        return Response(user.raw_data)


class Home(GithubAPIView):
    def get(self, request, format=None):
        user = self.github(request).get_user()
        limits = self.limits(request)
        projects = []

        for repo in user.get_repos():
            contributors = [
                contributor for contributor in repo.get_contributors()]
            projects.append({'repo': repo, 'contributors': contributors})

        data = {'user': user, 'limits': limits,
                'projects': projects}
                
        return Response(data)      


class Repos(GithubAPIView):
    def get(self, request, format=None):
        repos = self.repos(request)
        raw_repos = [repo.raw_data for repo in repos]

        return Response(raw_repos)


class Contributors(GithubAPIView):
    def get(self, request, format=None):
        contributors = self.contributors(request)
        raw_contributors = [
            contributor.raw_data for contributor in contributors]

        # return a colection of unique colaborators
        # unique_colaborators = list(
        #     {contributor['id']: contributor for contributor in raw_contributors}.values())

        return Response(raw_contributors)
