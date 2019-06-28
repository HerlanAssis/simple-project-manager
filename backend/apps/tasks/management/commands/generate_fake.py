from django.core.management.base import BaseCommand, CommandError
from apps.tasks.models import TaskManager, Task

from faker import Factory
import random

class Command(BaseCommand):
  help = 'Generate fake data for tasks app'

  def handle(self, *args, **options):
    """Fake data."""
    fake = Factory.create('pt_BR')

    max_tasks=37
    min_tasks=3
    max_task_title=20
    max_task_description=200
    PROGRESS = ['TODO', 'DOING', 'BLOCKED', 'DONE']

    for taskmanager in TaskManager.objects.all():
      
      for _ in range(random.randint(min_tasks, max_tasks)):
        
        if taskmanager.tasks.all().count() >= max_tasks:
          print("maximum number of tasks reached")
          break

        title=fake.text(max_nb_chars=max_task_title, ext_word_list=None)
        description=fake.text(max_nb_chars=max_task_description, ext_word_list=None)
        expected_date=fake.date_this_year(before_today=True, after_today=True)
        responsible=random.choice(taskmanager.vigilantes.all())
        status=random.choice(PROGRESS)

        task = Task(title=title, description=description, status=status, expected_date=expected_date, responsible=responsible, task_manager=taskmanager, owner=taskmanager.owner)
        task.save()

        print("Task {} saved!".format(title))
    
    print("All tasks generated with success!")