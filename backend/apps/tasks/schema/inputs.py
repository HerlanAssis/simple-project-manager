import graphene
from graphene_django.types import DjangoObjectType
from ..models import TaskManager, Task, Note, Release
from apps.core.schema.input import UserInput

class TaskManagerInput(graphene.InputObjectType):
  project_name = graphene.String()
  project_id = graphene.String()

class TaskInput(graphene.InputObjectType):
  title = graphene.String()
  description = graphene.String()
  status = graphene.String()
  expected_date = graphene.types.datetime.Date()
  responsible = UserInput()

class ReleaseInput(graphene.InputObjectType):  
  completed_on = graphene.types.datetime.Date()
  closed = graphene.Boolean()
  is_final_release = graphene.Boolean()
  title = graphene.String()
  description = graphene.String()

class NoteInput(graphene.InputObjectType):  
  description = graphene.String()