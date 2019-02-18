from .common import *

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
  }
}


MY_APPS = ['apps.github']

INSTALLED_APPS += MY_APPS