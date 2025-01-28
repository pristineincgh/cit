import os

from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class DB(BaseModel):
    host: str = os.getenv("DB_HOST")
    port: str = os.getenv("DB_PORT")
    user: str = os.getenv("DB_USER")
    password: str = os.getenv("DB_PASSWORD")
    name: str = os.getenv("DB_NAME")


class JWTSettings(BaseModel):
    secret: str = os.getenv("JWT_SECRET")
    algo: str = os.getenv("JWT_ALGO")
    exp_mins: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
    exp_days: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 1))


# class RedisConfig(BaseModel):
#     host: str = os.getenv("REDIS_HOST", "localhost")
#     port: int = os.getenv("REDIS_PORT", 6379)
#     db: int = os.getenv("REDIS_DB", 0)
#     jti_exp: int = os.getenv("JTI_EXPIRY_TIME", 3600)


class Settings(BaseSettings):
    db: DB = DB()
    JWT: JWTSettings = JWTSettings()
    # redis: RedisConfig = RedisConfig()

    model_config = SettingsConfigDict(
        env_nested_delimiter="__",
        extra="ignore",
    )


def get_settings() -> Settings:
    return Settings()
