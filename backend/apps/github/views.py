from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from github import Github


class GithubAPIView(APIView):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def github(self, request):
        access_token = request.user.social_auth.get(
            id=request.user.id).extra_data['access_token']

        return Github(access_token)


class User(GithubAPIView):
    def get(self, request, format=None):
        return Response(self.github(request).get_user().raw_data)


class Repos(GithubAPIView):
    def get(self, request, format=None):
        repos = []

        # Then play with your Github objects:
        for repo in self.github(request).get_user().get_repos():
            repos.append(repo.raw_data)

        return Response(repos)
