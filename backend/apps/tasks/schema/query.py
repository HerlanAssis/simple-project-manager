import graphene
from github import Github
from graphene_django.types import DjangoObjectType
# from django.db.models import Q
from apps.core.utils import get_or_none
from ..models import TaskManager, Task, Note, Release
from .types import TaskManagerType, TaskType, ReleaseType, NoteType

class Query(object):
  all_taskmanagers = graphene.List(TaskManagerType)
  taskmanager = graphene.Field(TaskManagerType, id=graphene.Int(), project_id=graphene.Int(), invitation_code=graphene.String(), owner=graphene.Boolean())

  all_tasks = graphene.List(TaskType)  
  task = graphene.Field(TaskType, id=graphene.Int())

  all_releases = graphene.List(ReleaseType)
  release = graphene.Field(ReleaseType, id=graphene.Int())
  
  all_notes = graphene.List(NoteType, task_id=graphene.Int())
  note = graphene.Field(NoteType, id=graphene.Int())

  def resolve_all_taskmanagers(self, info, **kwargs):
    return TaskManager.objects.filter(owner=info.context.user)

  def resolve_taskmanager(self, info, **kwargs):
    id = kwargs.get('id')
    project_id = kwargs.get('project_id')
    invitation_code = kwargs.get('invitation_code')
    owner = False

    if id is not None:
      return get_or_none(TaskManager, pk=id)

    if project_id is not None:
      taskmanager = get_or_none(TaskManager, project_id=project_id)
      
      if taskmanager is None:
        # verificar se ele é o 'dono'
        try:
          access_token = info.context.user.social_auth.get(
            provider='github').extra_data['access_token']

          github_instance = Github(login_or_token=access_token)

          user = github_instance.get_user()
          repo = github_instance.get_repo(project_id)
          
          if repo.owner.id == user.id:
            taskmanager = TaskManager(project_id=project_id, owner=info.context.user, project_name=repo.name)
            taskmanager.save()
        except Exception as e:
          pass

      if taskmanager:
        owner = taskmanager.owner.id == info.context.user.id
        
        if not owner:
          taskmanager.invitation_code = 'xxxxxxxxxx'
        
      return taskmanager
 
    if invitation_code is not None:
      return get_or_none(TaskManager, invitation_code=invitation_code, owner=info.context.user)

    return None
  
  def resolve_all_tasks(self, info, **kwargs):    
    user=info.context.user
    return Task.objects.filter(responsible=user)
    # return Task.objects.filter(Q(owner=user) | Q(responsible=user))    

  def resolve_task(self, info, **kwargs):
    id = kwargs.get('id')

    if id is not None:
      return get_or_none(Task, pk=id, owner=info.context.user)            

    return None
  
  def resolve_all_releases(self, info, **kwargs):
    return Release.objects.all()
  
  def resolve_release(self, info, **kwargs):
    id = kwargs.get('id')    

    if id is not None:
      return get_or_none(Release, pk=id)      

    return None

  def resolve_all_notes(self, info, **kwargs):    
    task_id = kwargs.get('task_id')
    task = get_or_none(Task, id=task_id)
    
    if task is not None:
      return Note.objects.filter(task=task)
    
    return None

  def resolve_note(self, info, **kwargs):
    id = kwargs.get('id')    

    if id is not None:
      return get_or_none(Note, pk=id, owner=info.context.user)

    return None
