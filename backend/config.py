import os

class Config:
    ENV = os.environ.get("FLASK_ENV", "development")
    DEBUG = os.environ.get("DEBUG", "false").lower() == "true"
    PORT = int(os.environ.get("PORT", 5000))
    
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    
    if ENV == "production":
        if not SECRET_KEY or SECRET_KEY == "change-me":
            raise RuntimeError("SECRET_KEY environment variable is required in production!")
        if not JWT_SECRET_KEY or JWT_SECRET_KEY == "change-me":
            raise RuntimeError("JWT_SECRET_KEY environment variable is required in production!")
    else:
        SECRET_KEY = SECRET_KEY or "dev-secret-key-change-me"
        JWT_SECRET_KEY = JWT_SECRET_KEY or "dev-jwt-secret-key-change-me"
        
    DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///complaints.db")
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # SQLite pooling compatibility
    if DATABASE_URL.startswith("sqlite"):
        SQLALCHEMY_ENGINE_OPTIONS = {}
    else:
        SQLALCHEMY_ENGINE_OPTIONS = {
            "pool_size": int(os.environ.get("DB_POOL_SIZE", 10)),
            "max_overflow": int(os.environ.get("DB_MAX_OVERFLOW", 20)),
            "pool_recycle": int(os.environ.get("DB_POOL_RECYCLE", 1800))
        }
        
    ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

class ProductionConfig(Config):
    DEBUG = False
