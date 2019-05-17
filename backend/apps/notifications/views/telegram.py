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
import telegram
from telegram.error import NetworkError, Unauthorized
from telegram import (ReplyKeyboardMarkup, ReplyKeyboardRemove)
from telegram.ext import (Updater, CommandHandler, MessageHandler, Filters, RegexHandler,
                          ConversationHandler)
from time import sleep
import telepot
from telepot import loop, Bot
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
# bot = telegram.Bot(os.environ.get("TELEGRAM_BOT_TOKEN"))

projetos_monitorados="/projetos_monitorados"
monitorar_novo_projeto="/monitorar_projeto"
cancelar_monitoramento="/cancelar_monitoramento"
# Comandos
comando_projetos_monitorados="{} para listar os projetos monitorados.\n".format(projetos_monitorados)
comando_monitorar_novo_projeto="{} seguido do código de autorização para monitorar um novo projeto.\n".format(monitorar_novo_projeto)
comando_cancelar_monitoramento="{} seguido do código de autorização para cancelar um monitoramento.\n".format(cancelar_monitoramento)
# reply_keyboard = [[projetos_monitorados], [monitorar_novo_projeto], [cancelar_monitoramento]]

def start_or_help(update):
  update.message.reply_text(
    'Oi! Eu sou responsável por notificar pessoas.\n',
    'O que você deseja fazer?\n',
    comando_projetos_monitorados,
    comando_monitorar_novo_projeto,
    comando_cancelar_monitoramento,
  )

def listar_projetos(update):
  meus_monitoramentos=Watcher.objects.all().filter(telegram_chat_id=update.message.chat.id)
  if(meus_monitoramentos):    
    update.message.reply_text(
      '{}'.format('\n'.join(map(str, meus_monitoramentos))),
    )
  else:  
    update.message.reply_text(
      'Você não ten nenhum projeto monitorado!',
    )

def monitorar_projeto(update, code):
  projeto=Watcher.objects.get(authorization_code=code)
  
  if projeto:
    projeto.telegram_chat_id=update.message.chat.id
    projeto.reset_authorization_code()
    projeto.save()    
    update.message.reply_text(
      'Projeto monitorado!',
    )
  else:
    update.message.reply_text(
      'Não entendi, caso tenha dúvidas tente utilizar o /help.',
    )

def cancelar_monitoramento(update, code):
  projeto=Watcher.objects.get(authorization_code=code)
  
  if projeto:
    projeto.telegram_chat_id=''
    projeto.reset_authorization_code()
    projeto.save()
    update.message.reply_text(
      'Monitoramento cancelado!',
    )
  else:
    update.message.reply_text(
      'Não entendi, caso tenha dúvidas tente utilizar o /help.',
    )

# def handler(bot):
#   global update_id
#   # Request updates after the last update_id
#   for update in bot.get_updates(offset=update_id, timeout=10):
#       update_id = update.update_id + 1
#       print(update)

#       if update.message:  # your bot can receive updates without messages
#         text = update.message.text
#         command = text.split(' ')          

#         if text=='/start' or text=='/help':
#           start_or_help(update)
#         if projetos_monitorados in text:
#           listar_projetos(update)
#         if monitorar_novo_projeto in text:
#           if len(command) > 1:
#             monitorar_novo_projeto(update, command[1])          
#         if cancelar_monitoramento in text:
#           if len(command) > 1:
#             cancelar_monitoramento            
#         else:
#           update.message.reply_text(
#             'Não entendi, caso tenha dúvidas tente utilizar o /help.',
#           )

# try:
#   update_id = bot.get_updates()[0].update_id
# except IndexError:
#   update_id = None

# while True:
#   try:
#       handler(bot)
#   except NetworkError:
#       sleep(1)
#   except Unauthorized:
#       # The user has removed or blocked the bot.
#       update_id += 1


def handle(msg):
  content_type, chat_type, chat_id = telepot.glance(msg)
  print(msg)

  if content_type == 'text':
    bot.sendMessage(chat_id, msg['text'])


bot = Bot(os.environ.get("TELEGRAM_BOT_TOKEN"))
bot.setWebhook("http://35.199.110.204/{}".format("api/n/telegrambot/"), max_connections=1)
# webhook = loop.OrderedWebhook(bot, handle)
# webhook.run_as_thread()