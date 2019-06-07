from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.core.models import BaseModel
from apps.core.utils import HASH_MAX_LENGTH, create_hash, truncate
from django.utils.encoding import python_2_unicode_compatible
from django.utils import timezone
from django.db.models import F
import datetime


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


@python_2_unicode_compatible
class TaskManager(BaseModel):
    project_name = models.CharField(max_length=256)
    project_id = models.BigIntegerField(unique=True, editable=False)
    owner = models.ForeignKey(
        User, related_name="managed_tasks", on_delete=models.CASCADE)
    invitation_code = models.CharField(
        max_length=HASH_MAX_LENGTH, default=create_hash, unique=True, editable=False)

    class Meta:
        unique_together = ['owner', 'project_id']

    @property
    def qtd_overdue_tasks(self):
        return self.tasks.exclude(status=DONE).filter(expected_date__lt=datetime.date.today()).count()

    @property
    def qtd_blocked_tasks(self):
        return self.tasks.filter(status=BLOCKED).count()

    @property
    def qtd_tasks_completed_late(self):
        return self.tasks.filter(status=DONE).filter(conclusion_date__gt=F('expected_date')).count()

    @property
    def qtd_tasks(self):
        return self.tasks.all().count()

    @property
    def progress(self):
        return self.tasks.filter(status=DONE).count()/self.tasks.all().count() * 100

    @property
    def qtd_completed_tasks(self):
        return self.tasks.filter(status=DONE).count()

    @property
    def qtd_open_tasks(self):
        return self.tasks.exclude(status=DONE).count()

    def notify(self, message, **kwargs):
        created = kwargs['created']
        message = "[{}] {}".format(self.project_name, message)

        notify_model = self.vigilantes.model
        notify_model.notify(self.vigilantes.all(), created, message)

    def resetInvitationCode(self):
        self.invitation_code = create_hash()
        self.save()

    def __str__(self):
        return "{}".format(self.project_name)


@python_2_unicode_compatible
class Task(BaseModel):
    status = models.CharField(
        max_length=64,
        choices=PROGRESS,
        default=TODO,
    )
    title = models.CharField(max_length=32)
    description = models.CharField(max_length=256, null=True, blank=True)
    task_manager = models.ForeignKey(
        TaskManager, related_name="tasks", on_delete=models.CASCADE)
    owner = models.ForeignKey(
        User, related_name="tasks", on_delete=models.CASCADE)
    responsible = models.ForeignKey(
        User, related_name="responsibilities_tasks", on_delete=models.CASCADE, blank=True)
    expected_date = models.DateField(blank=True)
    conclusion_date = models.DateField(blank=True, null=True, editable=False)

    def save(self, *args, **kwargs):
        if self.status == DONE:
            self.conclusion_date = datetime.date.today()
        else:
            self.conclusion_date = None
        task = super(Task, self).save(*args, **kwargs)        
        return task

    @property
    def is_overdue(self):
        if self.expected_date is None:
            return False
        return self.expected_date > datetime.date.today()

    @property
    def expires_today(self):
        if self.expected_date is None:
            return False
        return self.expected_date == datetime.date.today() and self.status != DONE

    # notify_task_manager
    def notify(self, **kwargs):
        self.task_manager.notify("{}: {} - {}".format(
            self.responsible.get_username(), self.get_status_display(), self.title), **kwargs)

    def __str__(self):
        return "{}: {} - {}".format(self.responsible.get_username(), self.get_status_display(), self.title)


@python_2_unicode_compatible
class Note(BaseModel):
    owner = models.ForeignKey(
        User, related_name="notes", on_delete=models.CASCADE)    
    task = models.ForeignKey(
        Task, related_name="task_notes", on_delete=models.CASCADE, blank=True)
    description = models.CharField(max_length=256)

    def __str__(self):
        return truncate(self.description, 10)


@python_2_unicode_compatible
class Release(BaseModel):
    completed_on = models.DateField()
    closed = models.BooleanField(default=False)
    is_final_release = models.BooleanField(default=False)
    title = models.CharField(max_length=32)
    description = models.CharField(max_length=256, blank=True)
    task_manager = models.ForeignKey(
        TaskManager, related_name="releases", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


# method for updating
@receiver(post_save, sender=Task)
def notify(sender, instance, **kwargs):
    instance.notify(**kwargs)
