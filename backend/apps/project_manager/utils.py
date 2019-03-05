from rest_framework import renderers
from rest_framework.utils import encoders
from github import GithubObject
import json


class PyGithubEncoder(encoders.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, GithubObject.GithubObject):            
            return obj.raw_data
        return super().default(obj)


class PyGithubJSONRenderer(renderers.JSONRenderer):
    encoder_class = PyGithubEncoder


# converte o objecto gitub para string depois para dict
def manual_dump(data):
    str_object = json.dumps(data, cls=PyGithubEncoder)        
    dict_object = json.loads(str_object)
    return dict_object
