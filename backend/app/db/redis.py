import redis.asyncio as redis

from app.core.config import get_settings

settings = get_settings()

JTI_EXPIRY_TIME = 3600  # one hour in seconds

token_blocklist = redis.Redis(host=settings.REDIS.host, port=settings.REDIS.port, db=0)


async def add_jti_to_blocklist(jti: str) -> None:
    await token_blocklist.set(name=jti, value="", ex=JTI_EXPIRY_TIME)


async def token_in_blocklist(jti: str) -> bool:
    jti_str = await token_blocklist.get(jti)

    return jti_str is not None
