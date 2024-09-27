from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseConfig(BaseSettings):
    MONGO_DB_URL: str
    MONGO_DB_NAME: str
    MYSQL_DB_URL: str

    """Loads the dotenv file. Including this is necessary to get
    pydantic to load a .env file."""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
