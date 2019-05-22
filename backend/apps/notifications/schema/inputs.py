import graphene

class WatcherInput(graphene.InputObjectType):
  notification_id=graphene.ID()
  vigilant_id=graphene.ID()
  invitation_code=graphene.String()

# class HistoryInput(graphene.InputObjectType):
#   id = graphene.ID()
#   created_at = graphene.types.datetime.DateTime()
#   updated_at = graphene.types.datetime.DateTime()