import graphene
from graphene_django.types import DjangoObjectType
from ..models import TaskManager, Task, Note, Release
from django.contrib.auth.models import User

class OwnerType(DjangoObjectType):  
  class Meta:
    model = User


class TaskManagerType(DjangoObjectType):
  class Meta:
    model = TaskManager


class TaskType(DjangoObjectType):
  status = graphene.Field(graphene.String, source='status')
  class Meta:
    model = Task


class ReleaseType(DjangoObjectType):
  class Meta:
    model = Release


class NoteType(DjangoObjectType):
  class Meta:
    model = Note
