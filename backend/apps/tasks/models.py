from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.core.models import BaseModel
from apps.core.utils import HASH_MAX_LENGTH, create_hash


class TaskManager(BaseModel):
  project_id = models.CharField(max_length=256, unique=True)
  owner = models.ForeignKey(User, related_name="managed_tasks", on_delete=models.CASCADE)
  invitation_code = models.CharField(max_length=HASH_MAX_LENGTH, default=create_hash, unique=True, editable=False)

  def notify(self, message):    
    for vigilant in self.vigilantes.all():
      vigilant.notify("Project {} - [{}]".format(self.project_id, message))

  def reset_invitation_code(self):
    self.invitation_code = create_hash()
    self.save()


class Task(BaseModel):
  TODO = 'TODO'
  DOING = 'DOING'
  BLOCKED = 'BLOCKED'
  DONE = 'DONE'
  PROGRESS = (
      (TODO, 'To Do'),
      (DOING, 'Doing'),
      (BLOCKED, 'Blocked'),
      (DONE, 'Done'),
  )
  status = models.CharField(
    max_length=64,
    choices=PROGRESS,
    default=TODO,
  )
  task_manager = models.ForeignKey(TaskManager, related_name="tasks", on_delete=models.CASCADE)  
  responsible = models.ForeignKey(User, related_name="responsibilities_tasks", on_delete=models.CASCADE)  
  description = models.CharField(max_length=256)

  # notify_task_manager
  def notify(self, message):
    self.task_manager.notify(message)


class Note(BaseModel):
  owner = models.ForeignKey(User, related_name="notes", on_delete=models.CASCADE)
  task = models.ForeignKey(Task, related_name="task_notes", on_delete=models.CASCADE, blank=True)
  description = models.CharField(max_length=256)


# method for updating
@receiver(post_save, sender=Task)
def notify(sender, instance, **kwargs):
  print(kwargs)
  instance.notify("TESTE")  
