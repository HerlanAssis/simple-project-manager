import graphene
from graphene_django.types import DjangoObjectType
from ..models import TaskManager, Task, Note, Release

class TaskManagerType(DjangoObjectType):
  class Meta:
      model = TaskManager


class TaskType(DjangoObjectType):
  class Meta:
    model = Task


class ReleaseType(DjangoObjectType):
  class Meta:
    model = Release


class NoteType(DjangoObjectType):
  class Meta:
      model = Note