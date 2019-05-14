from .common import *

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': os.environ.get("PG_NAME"),
    'USER': os.environ.get("PG_USER"),
    'HOST': os.environ.get("PG_HOST"),
    'PASSWORD': os.environ.get("PG_PASSWORD"),
    'PORT': os.environ.get("PG_PORT"),
  }
}