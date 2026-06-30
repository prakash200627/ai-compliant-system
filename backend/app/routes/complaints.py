from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.complaint_service import ComplaintService
from app.schemas.complaint import ComplaintCreateSchema
from app.schemas import validate_schema

complaints_bp = Blueprint("complaints", __name__, url_prefix="/complaints")

@complaints_bp.route("", methods=["POST"])
@jwt_required()
@validate_schema(ComplaintCreateSchema)
def create_complaint():
    user_id = int(get_jwt_identity())
    data = request.validated_data
    complaint, analysis = ComplaintService.create_complaint(
        user_id=user_id,
        title=data["title"],
        description=data["description"]
    )
    return jsonify({
        "message": "Complaint created successfully",
        "complaint_id": complaint.id,
        "category": analysis["category"],
        "priority": analysis["priority"]
    }), 201

@complaints_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_complaints():
    user_id = int(get_jwt_identity())
    complaints = ComplaintService.get_user_complaints(user_id)
    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "category": c.category,
            "priority": c.priority,
            "status": c.status,
            "created_at": c.created_at.isoformat()
        } for c in complaints
    ]), 200
