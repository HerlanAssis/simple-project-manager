import graphene
import apps.cookbook.schema

class Query(apps.cookbook.schema.Query, graphene.ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass