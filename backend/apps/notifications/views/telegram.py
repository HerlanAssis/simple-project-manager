import os
from math import ceil
from github import Github, enable_console_debug_logging
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.utils import encoders
from django.core.cache import cache
from django.conf import settings
import telepot
from telepot import loop, Bot

class TelegramAPIView(APIView):  
  pass

class MeninoDeRecadoBot(TelegramAPIView):    
  def get(self, request, format=None):
    webhook.feed(request.data)
    return Response("")

  def post(self, request, format=None):
    webhook.feed(request.data)    
    return Response("")


# def handle(msg):
#   if msg['text'] != '/vote':
#     print('Not /vote')
#   print(msg)

# def start(chat_id, bot):  
#   monitorar_projeto = {'comando':'\/monitorar_projeto', 'texto':'Monitorar novo projeto'}
#   listar_projetos = {'comando': '\/listar_projetos', 'texto':'Listar projetos monitorados'}

#   welcome_message='''Bem vindo! Para interagir utilize os comandos:
#     \n{} - {}
#     \n{} - {}
#   '''.format(**monitorar_projeto, **listar_projetos)

#   bot.sendMessage(chat_id, welcome_message)  


# def help(chat_id, bot):
#   pass

def handle(msg):
  content_type, chat_type, chat_id = telepot.glance(msg)
  print(msg)

  if content_type == 'text':
    bot.sendMessage(chat_id, msg['text'])


bot = Bot(os.environ.get("TELEGRAM_BOT_TOKEN"))
bot.setWebhook("http://35.199.110.204/{}".format("api/n/telegrambot/"), max_connections=1)
webhook = loop.OrderedWebhook(bot, handle)
webhook.run_as_thread()