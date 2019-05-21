import graphene
from graphene_django.types import DjangoObjectType
from .models import TaskManager, Task, Note, Release

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


class Query(object):
  all_taskmanagers = graphene.List(TaskManagerType)
  taskmanager = graphene.Field(TaskManagerType, id=graphene.Int(), project_id=graphene.String(), invitation_code=graphene.String())

  all_tasks = graphene.List(TaskType)
  task = graphene.Field(TaskType, id=graphene.Int())

  all_releases = graphene.List(ReleaseType)
  release = graphene.Field(ReleaseType, id=graphene.Int())
  
  all_notes = graphene.List(NoteType)
  note = graphene.Field(NoteType, id=graphene.Int())

  def resolve_all_taskmanagers(self, info, **kwargs):
    return TaskManager.objects.all()

  def resolve_taskmanager(self, info, **kwargs):
    id = kwargs.get('id')
    project_id = kwargs.get('project_id')
    invitation_code = kwargs.get('invitation_code')    

    if id is not None:
      return TaskManager.objects.get(pk=id)

    if project_id is not None:
      return TaskManager.objects.get(project_id=project_id)
    
    if invitation_code is not None:
      return TaskManager.objects.get(invitation_code=invitation_code)

    return None
  
  def resolve_all_tasks(self, info, **kwargs):
    return Task.objects.all()

  def resolve_task(self, info, **kwargs):
    id = kwargs.get('id')    

    if id is not None:
      return Task.objects.get(pk=id)    

    return None
  
  def resolve_all_releases(self, info, **kwargs):
    return Release.objects.all()
  
  def resolve_release(self, info, **kwargs):
    id = kwargs.get('id')    

    if id is not None:
      return Release.objects.get(pk=id)    

    return None

  def resolve_all_notes(self, info, **kwargs):
    return Note.objects.all()

  def resolve_note(self, info, **kwargs):
    id = kwargs.get('id')    

    if id is not None:
      return Note.objects.get(pk=id)    

    return None