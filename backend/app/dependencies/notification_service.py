from fastapi import HTTPException, status
from notificationapi_python_server_sdk import notificationapi
from app.utils.logging import logger
from app.core.config import get_settings

class NotificationService:
  def __init__(self):
    settings = get_settings()
    self.client_id = settings.notification.client_id
    self.client_secret = settings.notification.client_secret

    if not self.client_id or not self.client_secret:
      logger.error("NotificationAPI credentials are missing")
      raise ValueError("NotificationAPI credentials are missing")
    
    notificationapi.init(self.client_id, self.client_secret)

  @staticmethod
  async def send_notification(
      notification_id: str, email: str, merge_tags: dict, template_id: str = "default"
  ):
      """
      Send email notification to user
      """
      notification_payload = {
          "notificationId": notification_id,
          "user": {
              "id": email,
              "email": email,
          },
          "mergeTags": merge_tags,
          "templateId": template_id,
      }

      try:
          await notificationapi.send(notification_payload)
      except Exception as e:
          logger.error(f"Failed to send notification: {e}")
          raise HTTPException(
              status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
              detail="An unexpected error occurred.",
          )