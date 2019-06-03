import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth.models import User
from ..models import TaskManager, Task, Note, Release
from .types import TaskManagerType, TaskType, NoteType, ReleaseType
from .inputs import TaskManagerInput, TaskInput, NoteInput, ReleaseInput
from apps.core.utils import get_or_none


class CreateTaskManager(graphene.Mutation):
  class Arguments:
    input = TaskManagerInput(required=True)

  ok = graphene.Boolean()
  taskmanager = graphene.Field(TaskManagerType)

  @staticmethod
  def mutate(root, info, input=None):              
    ok = True
    taskmanager_instance = TaskManager(
      project_name=input.project_name,
      project_id=input.project_id,
      owner=info.context.user,
    )

    taskmanager_instance.save()
    return CreateTaskManager(ok=ok, taskmanager=taskmanager_instance)


class UpdateTaskManager(graphene.Mutation):
  class Arguments:
    id = graphene.Int(required=True)
    input = TaskManagerInput(required=True)

  ok = graphene.Boolean()
  taskmanager = graphene.Field(TaskManagerType)

  @staticmethod
  def mutate(root, info, id, input=None):
    ok = False
    taskmanager_instance = get_or_none(TaskManager, pk=id)
    
    if taskmanager_instance:
      ok = True      
      taskmanager_instance.project_name=input.project_name
      taskmanager_instance.save()
      return UpdateTaskManager(ok=ok, taskmanager=taskmanager_instance)

    return UpdateTaskManager(ok=ok, taskmanager=None)


class CreateTask(graphene.Mutation):
  class Arguments:
    taskmanager_id = graphene.Int(required=True)
    responsible_id = graphene.Int(required=False)
    input = TaskInput(required=True)

  ok = graphene.Boolean()
  task = graphene.Field(TaskType)

  @staticmethod
  def mutate(root, info, taskmanager_id, responsible_id, input=None):              
    ok = False
    taskmanager_instance = get_or_none(TaskManager, pk=taskmanager_id)
    if taskmanager_instance:
      context_user_is_the_taskmanager_owner = taskmanager_instance.owner.pk == info.context.user.pk
      if context_user_is_the_taskmanager_owner:
        
        ok = True
        task_instance = Task(
          status=input.status,
          title=input.title,
          description=input.description,
          expected_date=input.expected_date,
          owner=info.context.user,
          task_manager=taskmanager_instance,
        )
        responsible = get_or_none(User, pk=responsible_id)
        
        if responsible:
          task_instance.responsible=responsible

        task_instance.save()
        return CreateTask(ok=ok, task=task_instance)
    return CreateTask(ok=ok, task=None)


class UpdateTask(graphene.Mutation):
  class Arguments:
    id = graphene.Int(required=True)    
    responsible_id = graphene.Int(required=False)
    input = TaskInput(required=True)

  ok = graphene.Boolean()
  task = graphene.Field(TaskType)

  @staticmethod
  def mutate(root, info, id, responsible_id, input=None):              
    ok = False
    task_instance = get_or_none(Task, pk=id)
    responsible = get_or_none(User, pk=responsible_id)
    print("TASK {}".format(task_instance))
    print("RESPONS {}".format(responsible))
    
    if task_instance:
      context_user_is_the_task_owner = task_instance.owner.pk == info.context.user.pk      
      context_user_is_the_task_responsible = task_instance.responsible.pk == info.context.user.pk
      print("context_user_is_the_task_owner {}".format(context_user_is_the_task_owner))
      print("context_user_is_the_task_responsible {}".format(context_user_is_the_task_responsible))

      if context_user_is_the_task_owner or context_user_is_the_task_responsible:
        task_instance.status=input.status
        task_instance.title=input.title
        task_instance.description=input.description
        task_instance.expected_date=input.expected_date
        
        if responsible and context_user_is_the_task_owner:
          task_instance.responsible=responsible

        task_instance.save()

        return UpdateTask(ok=ok, task=task_instance)
    return UpdateTask(ok=ok, task=None)


class CreateRelease(graphene.Mutation):
  class Arguments:
    taskmanager_id = graphene.Int(required=True)    
    input = ReleaseInput(required=True)

  ok = graphene.Boolean()
  release = graphene.Field(ReleaseType)

  @staticmethod
  def mutate(root, info, taskmanager_id, input=None):              
    ok = False
    taskmanager_instance = get_or_none(TaskManager, pk=taskmanager_id)
    if taskmanager_instance:
      context_user_is_the_taskmanager_owner = taskmanager_instance.owner.pk == info.context.user.pk
      if context_user_is_the_taskmanager_owner:
        ok = True
        release_instance = Task(
          completed_on=input.completed_on,
          is_final_release=input.is_final_release,
          title=input.title,
          closed=input.closed,
          description=input.description,
          task_manager=taskmanager_instance,
        )
        release_instance.save()
        return CreateRelease(ok=ok, release=release_instance)
    return CreateRelease(ok=ok, release=None)


class UpdateRelease(graphene.Mutation):
  class Arguments:
    id = graphene.Int(required=True)        
    input = TaskInput(required=True)

  ok = graphene.Boolean()
  release = graphene.Field(ReleaseType)

  @staticmethod
  def mutate(root, info, id, input=None):              
    ok = False
    release_instance = get_or_none(Release, pk=id)
    if release_instance:
      context_user_is_the_taskmanager_release_owner = release_instance.task_manager.owner.pk == info.context.user.pk

      if context_user_is_the_taskmanager_release_owner:        
        release_instance.completed_on=input.completed_on
        release_instance.is_final_release=input.is_final_release
        release_instance.title=input.title
        release_instance.description=input.description
        release_instance.save()
        return UpdateRelease(ok=ok, release=release_instance)
        
    return UpdateRelease(ok=ok, release=None)


class CreateNote(graphene.Mutation):
  class Arguments:
    taskmanager_id = graphene.Int(required=True)    
    input = NoteInput(required=True)

  ok = graphene.Boolean()
  note = graphene.Field(NoteType)

  @staticmethod
  def mutate(root, info, taskmanager_id, task_id, input=None):              
    ok = False
    taskmanager_instance = get_or_none(TaskManager, pk=taskmanager_id)
    if taskmanager_instance:      
      ok = True
      note_instance = Note(
        description=input.description,
        task_manager=taskmanager_instance,
        owner=info.context.user,
      )      
      
      task_instance = get_or_none(Task, pk=task_id)
      if task_instance:        
        note_instance.task=task_instance

      note_instance.save()

      return CreateNote(ok=ok, note=note_instance)
    return CreateNote(ok=ok, note=None)


class UpdateNote(graphene.Mutation):
  class Arguments:
    id = graphene.Int(required=True)
    input = NoteInput(required=True)

  ok = graphene.Boolean()
  note = graphene.Field(NoteType)

  @staticmethod
  def mutate(root, info, id, task_id, input=None):              
    ok = False    
    note_instance = get_or_none(Note, pk=id)
    if note_instance:      
      ok = True
      note_instance.description=input.description

      task_instance = get_or_none(Task, pk=task_id)
      if task_instance:        
        note_instance.task=task_instance

      note_instance.save()

      return UpdateNote(ok=ok, note=note_instance)
    return UpdateNote(ok=ok, note=None)


class Mutation(graphene.ObjectType):  
    create_taskmanager = CreateTaskManager.Field()
    update_taskmanager = UpdateTaskManager.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    create_release = CreateRelease.Field()
    update_release = UpdateRelease.Field()
    create_note = CreateNote.Field()
    update_note = UpdateNote.Field()