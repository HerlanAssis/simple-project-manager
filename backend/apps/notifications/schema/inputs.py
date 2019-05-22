import graphene

class WatcherInput(graphene.InputObjectType):
  notification=graphene.String()  

# class HistoryInput(graphene.InputObjectType):
#   id = graphene.ID()
#   created_at = graphene.types.datetime.DateTime()
#   updated_at = graphene.types.datetime.DateTime()