import graphene
from graphene_django.types import DjangoObjectType
from .models import Watcher, History


class WatcherType(DjangoObjectType):
  class Meta:
    model = Watcher

class HistoryType(DjangoObjectType):
  class Meta:
      model = History


class Query(object):
  all_Watchers = graphene.List(WatcherType)
  all_historys = graphene.List(HistoryType)  

  def resolve_all_Watchers(self, info, **kwargs):
    return Watcher.objects.all()

  def resolve_all_historys(self, info, **kwargs):
    return History.objects.all()

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