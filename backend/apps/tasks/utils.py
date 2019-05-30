from apps.core.utils import get_or_none
from github import github

def get_or_create_taskmanager(classmodel, **kwargs):
  taskmanager = get_or_none(classmodel, **kwargs)
  
  if taskmanager is not None:
    return taskmanager    

  # verificar se ele é o 'dono'
  try:
    access_token = kwargs['owner'].social_auth.get(
      provider='github').extra_data['access_token']
    github_instance = Github(login_or_token=access_token)
    repo = github_instance.get_repo(kwargs['project_id'])
    if repo and repo.owner.id == kwargs['owner'].id:
      return classmodel(project_id=kwargs['project_id']).save()
  except Exception as e:
    print("ERRO DONO-{}".format(e))
    pass
  
  return None
  # segue o fluxo...