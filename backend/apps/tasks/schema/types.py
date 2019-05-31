import graphene
from graphene_django.types import DjangoObjectType
from ..models import TaskManager, Task, Note, Release
from django.contrib.auth.models import User

class OwnerType(DjangoObjectType):  
  class Meta:
    model = User


class TaskManagerType(DjangoObjectType):
  qtd_overdue_tasks = graphene.Int(source='qtd_overdue_tasks')
  qtd_tasks_completed_late = graphene.Int(source='qtd_tasks_completed_late')
  qtd_completed_tasks = graphene.Int(source='qtd_completed_tasks')
  qtd_open_tasks = graphene.Int(source='qtd_open_tasks')
  class Meta:
    model = TaskManager


class TaskType(DjangoObjectType):
  status = graphene.Field(graphene.String, source='status')
  is_overdue = graphene.Boolean(source='is_overdue')
  class Meta:
    model = Task


class ReleaseType(DjangoObjectType):
  class Meta:
    model = Release


class NoteType(DjangoObjectType):
  class Meta:
    model = Note
