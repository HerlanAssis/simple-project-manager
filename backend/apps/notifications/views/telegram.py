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
import logging
import telegram
from telegram.error import NetworkError, Unauthorized
from telegram import (ReplyKeyboardMarkup, ReplyKeyboardRemove)
from telegram.ext import (Updater, CommandHandler, MessageHandler, Filters, RegexHandler,
                          ConversationHandler)
from time import sleep
from ..models import Watcher


update_id = None

class TelegramAPIView(APIView):  
  pass

class MeninoDeRecadoBot(TelegramAPIView):    
  def get(self, request, format=None):
    return Response("")

  def post(self, request, format=None):
    return Response("")

# Telegram Bot Authorization Token
bot = telegram.Bot('722189281:AAEm1AEGB5XeXjUrFBru8zB8ND-wTHoelrE')
# Comandos
projetos_monitorados="Projetos monitorados"
monitorar_novo_projeto="Monitorar um novo projeto"
cancelar_monitoramento="Cancelar monitoramente"
reply_keyboard = [[projetos_monitorados], [monitorar_novo_projeto], [cancelar_monitoramento]]

def start_or_help(update):
  update.message.reply_text(
    'Oi! Eu sou responsável por notificar pessoas.\n',
    'O que você deseja fazer?',
    reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))

def listar_projetos(update):
  meus_monitoramentos=Watcher.objects.all().filter(telegram_chat_id=update.message.chat.id)
  print(meus_monitoramentos)

def monitorar_projeto(update):
  projeto=Watcher.objects.get(authorization_code=update.message)
  
  if projeto:
    projeto.telegram_chat_id=update.message.chat.id
    projeto.save()

  print(projeto)

def handler(bot):
  global update_id
  # Request updates after the last update_id
  for update in bot.get_updates(offset=update_id, timeout=10):
      update_id = update.update_id + 1
      print(update)

      if update.message:  # your bot can receive updates without messages
        if update.message.text=='/start' or update.message.text=='/help':
          start_or_help(update)
        if update.message.text == projetos_monitorados:
          listar_projetos(update)
        if update.message.text == monitorar_novo_projeto:
          pass
        if update.message.text == cancelar_monitoramento:
          pass
        else:
          update.message.reply_text(
            'Não entendi, caso tenha dúvidas tente utilizar o /help.',
          )

try:
  update_id = bot.get_updates()[0].update_id
except IndexError:
  update_id = None

while True:
  try:
      handler(bot)
  except NetworkError:
      sleep(1)
  except Unauthorized:
      # The user has removed or blocked the bot.
      update_id += 1


