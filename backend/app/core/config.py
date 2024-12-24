import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class DB(BaseModel):
    host: str = os.getenv("DB_Host")
    port: str = os.getenv("DB_PORT")
    user: str = os.getenv("DB_USER")
    password: str = os.getenv("DB_PASSWORD")
    name: str = os.getenv("DB_NAME")


class JWTSettings(BaseModel):
    secret: str = os.getenv("JWT_SECRET")
    algo: str = os.getenv("JWT_ALGO")


class RedisConfig(BaseModel):
    host: str = os.getenv("REDIS_HOST", "localhost")
    port: int = os.getenv("REDIS_PORT", 6379)


class Settings(BaseSettings):
    db: DB = DB()
    JWT: JWTSettings = JWTSettings()
    REDIS: RedisConfig = RedisConfig()

    model_config = SettingsConfigDict(env_nested_delimiter="__", extra="ignore")


@lru_cache
def get_settings():
    return Settings()
