from django.conf import settings
from django.core.mail import send_mail
from django.utils import crypto
HASH_MAX_LENGTH = 10

def create_hash():  
  return crypto.get_random_string(HASH_MAX_LENGTH)

def truncate(string, width):
    if len(string) > width:
        string = string[:width-3] + '...'
    return string

def sendMail(subject, message, recipient_list):  
  email_from = settings.EMAIL_HOST_USER
  # send_mail(subject, message, email_from, recipient_list)
  send_mail(subject, message, email_from, ['herlanassis@gmail.com'])

def get_or_none(classmodel, **kwargs):
  try:
    return classmodel.objects.get(**kwargs)
  except classmodel.DoesNotExist:
    return None
