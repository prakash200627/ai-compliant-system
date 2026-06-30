from flask import Blueprint, jsonify
from datetime import datetime
from app.extensions import db
from sqlalchemy.sql import text

health_routes = Blueprint('health', __name__)

@health_routes.route('/health', methods=['GET'])
def health_check():
    db_status = "ok"
    try:
        db.session.execute(text("SELECT 1"))
    except Exception as e:
        db_status = "offline"
        from flask import current_app
        current_app.logger.error(f"Database check failed: {e}")
        
    return jsonify({
        "status": "ok",
        "service": "ai-complaint-system",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "details": {
            "database": db_status
        }
    }), 200
