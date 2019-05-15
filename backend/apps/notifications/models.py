from django.db import models
from django.contrib.auth.models import User
from apps.core.models import BaseModel
from apps.tasks.models import TaskManager
from multiselectfield import MultiSelectField

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

  def sendMail(self, message):
    if self.EMAIL in self.notification:
      print("NOTIFY BY EMAIL - {}".format(message))      
    
  def sendTelegramNotification(self, message):
    if self.TELEGRAM in self.notification:
      print("NOTIFY BY TELEGRAM - {}".format(message))

  def notify(self, message):
    self.sendTelegramNotification(message)
    self.sendMail(message)