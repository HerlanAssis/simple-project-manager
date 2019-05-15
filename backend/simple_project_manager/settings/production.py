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

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get("MAILGUN_USER")
EMAIL_HOST_PASSWORD = os.environ.get("MAILGUN_PASS")
EMAIL_USE_TLS = True