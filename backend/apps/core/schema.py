import graphene
#import apps.project_manager.schema
from apps.tasks.schema.query import Query as TasksQuery
from apps.notifications.schema.query import Query as NotificationsQuery

from apps.notifications.schema.mutation import Mutation as NotificationsMutation

class Query(TasksQuery, NotificationsQuery):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass

class Mutation(NotificationsMutation):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass