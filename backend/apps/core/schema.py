import graphene
import apps.github.schema


class Query(apps.github.schema.Query, graphene.ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass
