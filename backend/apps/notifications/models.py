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
from apps.core.utils import HASH_MAX_LENGTH, create_hash, truncate
from django.utils.encoding import python_2_unicode_compatible


@python_2_unicode_compatible
class NotificationHistory(BaseModel):
  message = models.CharField(max_length=256, editable=False)

  def __str__(self):
    return truncate(self.message, 10)


@python_2_unicode_compatible
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

  def __str__(self):
    if self.vigilant and self.observer:
      return "{}-{}".format(self.observer, self.vigilant)
    return self.authorization_code

  def canSendMail(self):
    return self.observer.email and self.EMAIL in self.notification

  def canSendTelegramMessage(self):
    return self.telegram_chat_id and self.TELEGRAM in self.notification
  
  def getEmail(self):
    return self.observer.email

  def sendMailNotification(self, message):
    if self.canSendMail():
      subject = 'Thank you for registering to our site'      
      email_from = settings.EMAIL_HOST_USER
      recipient_list = ['herlanassis@gmail.com',]
      send_mail(subject, message, email_from, recipient_list)      
    
  def sendTelegramNotification(self, message):
    if self.canSendTelegramMessage():
      bot = telegram.Bot(os.environ.get("TELEGRAM_BOT_TOKEN"))
      bot.send_message(chat_id=self.telegram_chat_id, text=message)

  def sendNotification(self, message):
    NotificationHistory(message=message).save()
    self.sendTelegramNotification(message)
  
  def resetAuthorizationCode(self):
    self.authorization_code = create_hash()
    self.save()

  @staticmethod
  def sendMassiveMailNotification(vigilantes, message):
    if vigilantes:
      emails = []
      for vigilant in vigilantes:
        if vigilant.canSendMail():
          emails.append(vigilant.getEmail())    
      email_from = settings.EMAIL_HOST_USER  
    # send_mail(subject, message, email_from, emails)
      send_mail("Nova tarefa", message, email_from, ['herlanassis@gmail.com'])
