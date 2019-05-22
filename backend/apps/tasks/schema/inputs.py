import graphene
from graphene_django.types import DjangoObjectType
from ..models import TaskManager, Task, Note, Release

class TaskManagerInput(graphene.InputObjectType):
  project_name = graphene.String()
  project_id = graphene.String()

class TaskInput(graphene.InputObjectType):
  title = graphene.String()
  description = graphene.String()
  status = graphene.String()

class ReleaseInput(graphene.InputObjectType):  
  completed_on = graphene.types.datetime.Date()
  is_final_release = graphene.Boolean()
  title = graphene.String()
  description = graphene.String()

class NoteInput(graphene.InputObjectType):  
  description = graphene.String()