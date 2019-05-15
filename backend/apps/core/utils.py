from django.utils import crypto
HASH_MAX_LENGTH = 10

def create_hash():  
  return crypto.get_random_string(HASH_MAX_LENGTH)
