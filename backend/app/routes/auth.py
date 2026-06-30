from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from app.schemas.auth import RegisterSchema, LoginSchema, DevLoginSchema
from app.schemas import validate_schema
from app.extensions import limiter
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
@limiter.limit("5 per minute")
@validate_schema(RegisterSchema)
def register():
    data = request.validated_data
    user, error = AuthService.register_user(
        name=data.get("name"),
        email=data["email"],
        password=data["password"],
        role=data.get("role", "user")
    )
    if error:
        return jsonify({"error": error, "status": 409}), 409
        
    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
@validate_schema(LoginSchema)
def login():
    data = request.validated_data
    token, error = AuthService.login_user(
        email=data["email"],
        password=data["password"]
    )
    if error:
        return jsonify({"error": error, "status": 401}), 401
        
    return jsonify({"access_token": token}), 200

@auth_bp.route("/dev-login", methods=["POST"])
@validate_schema(DevLoginSchema)
def dev_login():
    data = request.validated_data
    token = AuthService.dev_login(email=data["email"])
    return jsonify({"access_token": token}), 200

@auth_bp.route("/make-admin", methods=["POST"])
@jwt_required()
def make_admin():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({"error": "User not found", "status": 404}), 404
    user.role = "admin"
    db.session.commit()
    return jsonify({"msg": "User promoted to admin"}), 200
