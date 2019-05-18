import graphene
from graphene_django.types import DjangoObjectType
from .models import TaskManager, Task, Note

class TaskManagerType(DjangoObjectType):
  class Meta:
      model = TaskManager

class TaskType(DjangoObjectType):
  class Meta:
    model = Task

class NoteType(DjangoObjectType):
  class Meta:
      model = Note


class Query(object):
  all_taskmanagers = graphene.List(TaskManagerType)
  all_tasks = graphene.List(TaskType)
  all_notes = graphene.List(NoteType)

  def resolve_all_taskmanagers(self, info, **kwargs):
    return TaskManager.objects.all()

  def resolve_all_tasks(self, info, **kwargs):
    return Tasks.objects.all()

  def resolve_all_notes(self, info, **kwargs):
    return Notes.objects.all()

# class Query(object):
#     category = graphene.Field(CategoryType,
#                               id=graphene.Int(),
#                               name=graphene.String())
#     all_categories = graphene.List(CategoryType)

#     ingredient = graphene.Field(IngredientType,
#                                 id=graphene.Int(),
#                                 name=graphene.String())
#     all_ingredients = graphene.List(IngredientType)

#     def resolve_all_categories(self, info, **kwargs):
#         return Category.objects.all()

#     def resolve_all_ingredients(self, info, **kwargs):
#         return Ingredient.objects.all()

#     def resolve_category(self, info, **kwargs):
#         id = kwargs.get('id')
#         name = kwargs.get('name')

#         if id is not None:
#             return Category.objects.get(pk=id)

#         if name is not None:
#             return Category.objects.get(name=name)

#         return None

#     def resolve_ingredient(self, info, **kwargs):
#         id = kwargs.get('id')
#         name = kwargs.get('name')

#         if id is not None:
#             return Ingredient.objects.get(pk=id)

#         if name is not None:
#             return Ingredient.objects.get(name=name)

#         return None