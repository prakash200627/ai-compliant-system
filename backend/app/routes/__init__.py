from app.routes.auth import auth_bp
from app.routes.complaints import complaints_bp
from app.routes.admin import admin_bp
from app.routes.health import health_routes

__all__ = ["auth_bp", "complaints_bp", "admin_bp", "health_routes"]
