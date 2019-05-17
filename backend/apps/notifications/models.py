import os
from django.db import models
from django.contrib.auth.models import User
from apps.core.models import BaseModel
from apps.core.utils import HASH_MAX_LENGTH, create_hash
from apps.tasks.models import TaskManager
from multiselectfield import MultiSelectField
from django.core.mail import send_mail
from django.conf import settings
import telegram

def sendMail(subject, message, recipient_list):
  # subject = 'Thank you for registering to our site'
  # message = ' it  means a world to us '
  # recipient_list = ['receiver@gmail.com',]
  email_from = settings.EMAIL_HOST_USER
  send_mail(subject, message, email_from, recipient_list)


class Watcher(BaseModel):
  TELEGRAM = 'TELEGRAM'
  EMAIL = 'EMAIL'  

  NOTIFICATION_OPTIONS = (
    (TELEGRAM, 'Telegram'),
    (EMAIL, 'Email'),
  )

  notification = MultiSelectField(choices=NOTIFICATION_OPTIONS)
  vigilant = models.ForeignKey(TaskManager, related_name="vigilantes", on_delete=models.CASCADE)
  observer = models.ForeignKey(User, related_name="observers", on_delete=models.CASCADE)
  
  authorization_code = models.CharField(max_length=HASH_MAX_LENGTH, default=create_hash, unique=True, editable=False)    
  telegram_chat_id = models.CharField(max_length=16, blank=True)

  def sendMail(self, message):
    if self.observer.email and self.EMAIL in self.notification:
      subject = 'Thank you for registering to our site'      
      email_from = settings.EMAIL_HOST_USER
      recipient_list = ['herlanassis@gmail.com',]
      send_mail(subject, message, email_from, recipient_list)
      print("NOTIFY BY EMAIL FOR {} - {}".format(self.observer.email, message))
    
  def sendTelegramNotification(self, message):
    if self.telegram_chat_id and self.TELEGRAM in self.notification:
      bot = telegram.Bot(os.environ.get("TELEGRAM_BOT_TOKEN"))
      bot.send_message(chat_id=self.telegram_chat_id, text="Teste.")

  def notify(self, message):
    self.sendTelegramNotification(message)
    self.sendMail(message)
    
  def reset_authorization_code(self):
    self.authorization_code = create_hash()
    self.save()