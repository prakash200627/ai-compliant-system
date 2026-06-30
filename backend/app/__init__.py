import os
import time
import traceback
from flask import Flask, jsonify, g, request
from flask_cors import CORS
from config import Config
from werkzeug.exceptions import HTTPException
from flask_limiter.errors import RateLimitExceeded

from app.extensions import db, jwt, bcrypt, limiter, migrate
from app.routes import auth_bp, complaints_bp, admin_bp, health_routes
from app.utils.logging import setup_logger

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 1. Setup Structured JSON Logging
    setup_logger(app, app.config.get("LOG_LEVEL", "INFO"))

    # Log startup config (mask secrets)
    masked_config = {}
    for key, val in app.config.items():
        if any(sec in key.lower() for sec in ["secret", "key", "password"]):
            masked_config[key] = "*****"
        elif isinstance(val, (str, int, float, bool, type(None))):
            masked_config[key] = val
        else:
            masked_config[key] = str(val)
    app.logger.info("Initializing AI Complaint System backend", extra={"config": masked_config})

    # 2. Setup CORS
    origins = [o.strip() for o in app.config["ALLOWED_ORIGINS"].split(",") if o.strip()]
    CORS(app, resources={r"/*": {"origins": origins}})

    # 3. Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    # 4. Request Timing Logging Middleware
    @app.before_request
    def start_timer():
        g.start_time = time.time()

    @app.after_request
    def log_request(response):
        if request.path == "/health":
            return response

        duration = time.time() - g.get("start_time", time.time())
        app.logger.info("Incoming request", extra={
            "method": request.method,
            "path": request.path,
            "status": response.status_code,
            "duration": f"{duration:.4f}s"
        })
        return response

    # 5. Global Error Handling
    @app.errorhandler(RateLimitExceeded)
    def handle_rate_limit(e):
        return jsonify({
            "error": "Rate limit exceeded. Max 5 requests per minute.",
            "status": 429
        }), 429

    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            status_code = e.code
            message = e.description
        else:
            status_code = 500
            message = "Internal Server Error"

        app.logger.error(f"Unhandled Exception: {str(e)}", extra={
            "traceback": traceback.format_exc(),
            "path": request.path,
            "method": request.method
        })

        return jsonify({
            "error": message,
            "status": status_code
        }), status_code

    # 6. Customize JWT Error Responses
    @jwt.unauthorized_loader
    def unauthorized_callback(err_str):
        return jsonify({
            "error": f"Unauthorized: {err_str}",
            "status": 401
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(err_str):
        return jsonify({
            "error": f"Invalid token: {err_str}",
            "status": 401
        }), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "error": "Token has expired",
            "status": 401
        }), 401

    # 7. Register Blueprints
    app.register_blueprint(health_routes)
    app.register_blueprint(auth_bp)
    app.register_blueprint(complaints_bp)
    app.register_blueprint(admin_bp)

    # 8. Create Tables for Dev / Testing envs
    if app.config.get("ENV") == "development" or app.config.get("TESTING"):
        with app.app_context():
            import time
            for attempt in range(5):
                try:
                    db.create_all()
                    break
                except Exception as e:
                    err_msg = str(e).lower()
                    if "already exists" in err_msg:
                        app.logger.info("Table already exists (handled concurrent boot race condition).")
                        break
                    elif "locked" in err_msg:
                        app.logger.warning(f"Database is locked, retrying in 1s (attempt {attempt + 1}/5)...")
                        time.sleep(1)
                    else:
                        raise e

    return app
