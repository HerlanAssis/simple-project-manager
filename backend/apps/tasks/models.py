from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.core.models import BaseModel
from apps.core.utils import HASH_MAX_LENGTH, create_hash, truncate, sendMail
from django.utils.encoding import python_2_unicode_compatible

@python_2_unicode_compatible
class TaskManager(BaseModel):
  project_name= models.CharField(max_length=256)
  project_id = models.CharField(max_length=256, unique=True)
  owner = models.ForeignKey(User, related_name="managed_tasks", on_delete=models.CASCADE)
  invitation_code = models.CharField(max_length=HASH_MAX_LENGTH, default=create_hash, unique=True, editable=False)

  def notify(self, message, **kwargs):    
    created=kwargs['created']

    if created:
      emails = []
      for vigilant in self.vigilantes.all():
        if vigilant.canSendMail():
          emails.append(vigilant.getEmail())
      sendMail("Nova tarefa", message, emails)
    else:
      for vigilant in self.vigilantes.all():
        vigilant.sendNotification("[{}] {}".format(self.project_name, message))

  def reset_invitation_code(self):
    self.invitation_code = create_hash()
    self.save()

  def __str__(self):
    return "{}".format(self.project_name)


@python_2_unicode_compatible
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
  title = models.CharField(max_length=256)
  description = models.CharField(max_length=256, blank=True)

  # notify_task_manager
  def notify(self, **kwargs):
    self.task_manager.notify("{}: {} - {}".format(self.responsible.get_username(), self.get_status_display(), self.title), **kwargs)
  
  def __str__(self):
    return "{}: {} - {}".format(self.responsible.get_username(), self.get_status_display(), self.title)


@python_2_unicode_compatible
class Note(BaseModel):
  owner = models.ForeignKey(User, related_name="notes", on_delete=models.CASCADE)
  task = models.ForeignKey(Task, related_name="task_notes", on_delete=models.CASCADE, blank=True)  
  description = models.CharField(max_length=256)

  def __str__(self):
    return truncate(self.description, 10)


# method for updating
@receiver(post_save, sender=Task)
def notify(sender, instance, **kwargs):  
  # root: To Do - Trabalho de Conclusão de Curso {'signal': <django.db.models.signals.ModelSignal object at 0x7f04b51be6d8>, 'created': False, 'update_fields': None, 'raw': False, 'using': 'default'}
  instance.notify(**kwargs)
