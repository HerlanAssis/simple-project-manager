import os
from django.db import models
from django.contrib.auth.models import User
from apps.core.models import BaseModel
from apps.core.utils import HASH_MAX_LENGTH, create_hash
from apps.tasks.models import TaskManager
from multiselectfield import MultiSelectField
from django.core.mail import send_mail
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
import telegram
from apps.core.utils import HASH_MAX_LENGTH, create_hash, truncate
from django.utils.encoding import python_2_unicode_compatible
from apps.core.utils import get_or_none


TELEGRAM = 'TELEGRAM'
EMAIL = 'EMAIL'  

NOTIFICATION_OPTIONS = (
  (TELEGRAM, 'Telegram'),
  (EMAIL, 'Email'),
)

@python_2_unicode_compatible
class Watcher(BaseModel):
  notification = MultiSelectField(choices=NOTIFICATION_OPTIONS, default=[default[0] for default in NOTIFICATION_OPTIONS])
  vigilant = models.ForeignKey(TaskManager, related_name="vigilantes", on_delete=models.CASCADE)
  observer = models.ForeignKey(User, related_name="observers", on_delete=models.CASCADE)
  
  authorization_code = models.CharField(max_length=HASH_MAX_LENGTH, default=create_hash, unique=True, editable=False)    
  telegram_chat_id = models.CharField(max_length=16, blank=True)

  class Meta:
    unique_together = ['vigilant', 'observer']

  def __str__(self):
    if self.vigilant and self.observer:
      return "{}-{}".format(self.observer, self.vigilant)
    return self.authorization_code

  def canSendMail(self):
    return self.observer.email and EMAIL in self.notification

  def canSendTelegramMessage(self):
    return self.telegram_chat_id and TELEGRAM in self.notification
  
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
  
  def resetAuthorizationCode(self):
    self.authorization_code = create_hash()
    self.save()

  @staticmethod
  def getVigilantBy(invitation_code = None, project_id = None):    
    if invitation_code:
      return get_or_none(TaskManager, invitation_code=invitation_code)
    
    if project_id:
      return get_or_none(TaskManager, project_id=project_id)
    
    return None
  
  @staticmethod
  def getOrCreateVigilantWatcherBy(project_id = None, user = None):    
    if project_id and user:
      vigilant = Watcher.getVigilantBy(project_id = project_id)
      watcher = vigilant.vigilantes.get_or_create(observer=user, vigilant=vigilant)

      return watcher[0]
    return None

  @staticmethod
  def notify(vigilantes, created, message):
    if vigilantes:
      emails = []
      for vigilant in vigilantes:
        #Generate a history register
        History(message=message, created=created, sources=vigilant.notification, watcher=vigilant).save()

        # collect emails
        if vigilant.canSendMail():
          emails.append(vigilant.getEmail())

        # send telegram notification
        if vigilant.canSendTelegramMessage():
          vigilant.sendTelegramNotification(message)

      if created:
        # send email notification for many users
        email_from = settings.EMAIL_HOST_USER        
        try:
          send_mail("Nova tarefa", message, email_from, emails)
        except Exception as e:
          pass


@python_2_unicode_compatible
class History(BaseModel):
  sources = MultiSelectField(choices=NOTIFICATION_OPTIONS, editable=False)
  message = models.CharField(max_length=256, editable=False)
  created = models.BooleanField(default=False, editable=False)

  watcher = models.ForeignKey(Watcher, related_name="histories", on_delete=models.CASCADE)  

  def __str__(self):
    return truncate(self.message, 10)


# method for autocreate an watcher for your taskmanager owner
@receiver(post_save, sender=TaskManager)
def notify(sender, instance, **kwargs):  
  created=kwargs['created']
  if created:
    Watcher(vigilant=instance, observer=instance.owner).save()
