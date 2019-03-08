"""
Django settings for simple_project_manager project.

Generated by 'django-admin startproject' using Django 2.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '&krfun!+s06r#zox&$9wzf2ma!wy=$kj(*h)glk4$l$%7=tthc'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INTERNAL_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

EXTERNAL_APPS = [
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'social_django',
    'rest_social_auth',

    'oauth2_provider',
    'rest_framework_social_oauth2',

    'graphene_django',
]

MY_APPS = [
    'apps.core',
    'apps.api',
    'apps.project_manager',
    'apps.clients',
    'apps.notifications',
    'apps.reports',
    'apps.tasks',
]

INSTALLED_APPS = INTERNAL_APPS + EXTERNAL_APPS + MY_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

INTERNAL_IPS = ['127.0.0.1']

ROOT_URLCONF = 'simple_project_manager.urls'

GRAPHENE = {
    'SCHEMA': 'simple_project_manager.schema.schema'
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # Social contexts
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': 'cache:11211',
        'KEY_PREFIX': 'backend',
    }
}

CACHE_LEVEL = {
    'ONE': 60,  # 1 minuto
    'TWO': 60 * 5,  # 5 minutos
    'THREE': 60 * 60,  # 1 hora
    'FOUR': 60 * 60 * 5,  # 5 horas
    'FIVE': 60 * 60 * 24,  # um dia
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
        'rest_framework_social_oauth2.authentication.SocialAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    )    
}

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',  # for Google authentication
    'social_core.backends.github.GithubOAuth2',  # for Github authentication
    'rest_framework_social_oauth2.backends.DjangoOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_GITHUB_KEY = 'c3f39f63ffb0d5ca5b9d'
SOCIAL_AUTH_GITHUB_SECRET = '2df19646ab5b3a247246cae191d55029c5eb740b'
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '868259763295-0h7tcmihv8l91nlfkk2pu60m2o976ck5.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'NxT54Fv9O4UZjUyVAJvjtWqd'

# DJANGO OAUTH TOOLKIT EXPIRATION SECONDS  - DEFAULT IS 36000 WHICH IS 10 hours
OAUTH2_PROVIDER = {
    'ACCESS_TOKEN_EXPIRE_SECONDS': 36000,
}

WSGI_APPLICATION = 'simple_project_manager.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# https://docs.djangoproject.com/en/2.1/topics/i18n/
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Fortaleza'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# https://docs.djangoproject.com/en/2.1/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
# STATICFILES_DIRS = (
#     os.path.join(BASE_DIR, 'static'),
# )

# When using PostgreSQL, it’s recommended to use the built-in JSONB field to store the extracted extra_data.
SOCIAL_AUTH_POSTGRES_JSONFIELD = True

CORS_ORIGIN_WHITELIST = (
    'localhost',
    'localhost:3000',
    'spm.com.br:3000',
)

CORS_ALLOW_CREDENTIALS = True
SOCIAL_AUTH_RAISE_EXCEPTIONS = True
SOCIAL_AUTH_URL_NAMESPACE = 'social'

# LOGIN_REDIRECT_URL = '/'
# REST_SOCIAL_OAUTH_REDIRECT_URI = '/'
# REST_SOCIAL_DOMAIN_FROM_ORIGIN = False

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.social_auth.associate_by_email',
    'social_core.pipeline.user.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
)

SITE_ID = 1
