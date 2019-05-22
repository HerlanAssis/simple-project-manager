import graphene
#import apps.project_manager.schema
import apps.tasks.schema
import apps.notifications.schema

class Query(apps.tasks.schema.query.Query, apps.notifications.schema.query.Query):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass

class Mutation(apps.notifications.schema.mutation.Mutation):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass