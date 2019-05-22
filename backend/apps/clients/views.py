from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from apps.core.serializers import CurrentUserSerializer
from rest_framework.settings import api_settings
# enable_console_debug_logging()

class GoogleAPIView(APIView):
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES    
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer, )

    def get_google_instance(self, request):
        access_token = request.user.social_auth.get(
            provider='google-oauth2').extra_data['access_token']
        return access_token


class User(GoogleAPIView):
    def get(self, request, format=None):
        user = CurrentUserSerializer(request.user)
        content = {'user': user.data, 'token': self.get_google_instance(request)}
        return Response(content)
