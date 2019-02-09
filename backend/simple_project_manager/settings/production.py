from .common import *

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': 'postgres',
    'USER': 'postgres',
    'HOST': 'database',
    'PORT': 5432,
  }
}