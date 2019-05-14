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
  watcher = models.ForeignKey(TaskManager, related_name="observed_tasks", on_delete=models.CASCADE,)
  observer = models.ForeignKey(User, related_name="observers", on_delete=models.CASCADE,)

  def sendMail(self):
    if self.notification in (self.EMAIL):
      print("NOTIFY BY EMAIL")      
    
  def sendTelegramNotification(self):
    if self.notification in (self.TELEGRAM):
      print("NOTIFY BY TELEGRAM")

  def notify(self):
    self.sendTelegramNotification()
    self.sendMail()