import secrets


def generate_password(length: int = 16) -> str:
  """
  Generate a random password.
  """

  return secrets.token_urlsafe(length)