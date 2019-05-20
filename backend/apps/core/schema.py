import graphene
#import apps.project_manager.schema
import apps.tasks.schema
import apps.notifications.schema

class Query(apps.tasks.schema.Query, apps.notifications.schema.Query):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass
