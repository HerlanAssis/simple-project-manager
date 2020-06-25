
from rest_framework.response import Response
from rest_framework.views import APIView

class TelegramAPIView(APIView):  
  pass

class MeninoDeRecadoBot(TelegramAPIView):    
  def get(self, request, format=None):
    return Response("")

  def post(self, request, format=None):
    return Response("")