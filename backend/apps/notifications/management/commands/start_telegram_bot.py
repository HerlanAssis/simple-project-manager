from django.core.management.base import BaseCommand, CommandError
from apps.notifications.models import Watcher
import os
import telegram
from telegram.error import NetworkError, Unauthorized
from time import sleep

update_id = None

## COMANDOS

# instrucoes
projetos_monitorados="/projetos_monitorados"
monitorar_novo_projeto="/monitorar_projeto"
cancelar_monitoramento="/cancelar_monitoramento"
comando_projetos_monitorados="{} para listar os projetos monitorados.".format(projetos_monitorados)
comando_monitorar_novo_projeto="{} seguido do código de autorização para monitorar um novo projeto.".format(monitorar_novo_projeto)
comando_cancelar_monitoramento="{} seguido do código de autorização para cancelar um monitoramento.".format(cancelar_monitoramento)

def start_or_help(update):    
  update.message.reply_text(
    'Oi! Eu sou responsável por notificar pessoas.\n'
    'O que você deseja fazer?\n'
    '{}\n{}\n{}'.format(comando_projetos_monitorados,comando_monitorar_novo_projeto,comando_cancelar_monitoramento)
  )

def listar_projetos(update):
  meus_monitoramentos=Watcher.objects.all().filter(telegram_chat_id=update.message.chat.id)
  if(meus_monitoramentos):    
    update.message.reply_text(
      '{}'.format('\n'.join(map(str, meus_monitoramentos))),
    )
  else:  
    update.message.reply_text('Você não tem nenhum projeto monitorado!')

def monitorar_projeto(update, code):
  print("**************** {}".format(code))

  try:
    projeto=Watcher.objects.get(authorization_code=code)      
  except Watcher.DoesNotExist:
    projeto = None  
  
  if projeto:
    projeto.telegram_chat_id=update.message.chat.id
    projeto.reset_authorization_code()
    projeto.save()    
    update.message.reply_text('Projeto monitorado!')
  else:
    update.message.reply_text('Projeto não encontrado. Caso tenha dúvidas tente utilizar o /help')

def cancele_o_monitoramento(update, code):  
  try:
    projeto=Watcher.objects.get(authorization_code=code)      
  except Watcher.DoesNotExist:
    projeto = None
  
  if projeto:
    projeto.telegram_chat_id=''
    projeto.reset_authorization_code()
    projeto.save()
    update.message.reply_text('Monitoramento cancelado!')
  else:
    update.message.reply_text('Projeto não encontrado. Caso tenha dúvidas tente utilizar o /help')
##FIM

def listen_bot(bot):
  """Echo the message the user sent."""
  global update_id
  # Request updates after the last update_id
  for update in bot.get_updates(offset=update_id, timeout=10):
    update_id = update.update_id + 1

    if update.message:  # your bot can receive updates without messages
      text = update.message.text
      command = text.split(' ')

      if text=='/start' or text=='/help':          
        start_or_help(update)
      elif projetos_monitorados in text:
        listar_projetos(update)
      elif monitorar_novo_projeto in text:
        if len(command) > 1:
          monitorar_projeto(update, command[1])
        else:
          update.message.reply_text('Código inválido! Caso tenha dúvidas tente utilizar o /help')
      elif cancelar_monitoramento in text:
        if len(command) > 1:
          cancele_o_monitoramento(update, command[1])
        else:
          update.message.reply_text('Código inválido! Caso tenha dúvidas tente utilizar o /help')
      else:
        update.message.reply_text('Não entendi, caso tenha dúvidas tente utilizar o /help.')


class Command(BaseCommand):
  help = 'Start a pure bot'

  def handle(self, *args, **options):
    """Run the bot."""
    global update_id
    # Telegram Bot Authorization Token
    bot = telegram.Bot(os.environ.get("TELEGRAM_BOT_TOKEN"))

    # get the first pending update_id, this is so we can skip over it in case
    # we get an "Unauthorized" exception.
    try:
      update_id = bot.get_updates()[0].update_id
    except IndexError:
      update_id = None        

    while True:
      try:
        listen_bot(bot)
      except NetworkError:
        sleep(1)
      except Unauthorized:
        # The user has removed or blocked the bot.
        update_id += 1