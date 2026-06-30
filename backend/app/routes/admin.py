from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required
from app.services.auth_service import get_current_user, user_has_role
from app.services.complaint_service import ComplaintService
from app.schemas.complaint import ComplaintStatusUpdateSchema
from app.schemas import validate_schema
from app.models.escalation_log import EscalationLog

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@admin_bp.route("/escalations", methods=["GET"])
@jwt_required()
def view_escalations():
    user = get_current_user()
    if not user_has_role(user, "admin", "agent"):
        return jsonify({"error": "Access denied", "status": 403}), 403
        
    escalations = EscalationLog.query.all()
    return jsonify([
        {
            "id": e.id,
            "complaint_id": e.complaint_id,
            "from": e.from_level,
            "to": e.to_level,
            "reason": e.reason,
            "timestamp": e.timestamp.isoformat()
        } for e in escalations
    ]), 200

@admin_bp.route("/complaints/<int:complaint_id>/status", methods=["PUT"])
@jwt_required()
@validate_schema(ComplaintStatusUpdateSchema)
def update_complaint_status(complaint_id):
    user = get_current_user()
    if not user_has_role(user, "admin", "agent"):
        return jsonify({"error": "Access denied", "status": 403}), 403
        
    data = request.validated_data
    complaint, error = ComplaintService.update_complaint_status(complaint_id, data["status"])
    if error:
        if error == "Complaint not found":
            return jsonify({"error": "Complaint not found", "status": 404}), 404
        return jsonify({"error": error, "status": 400}), 400
        
    return jsonify({
        "msg": "Status updated",
        "complaint_id": complaint.id,
        "status": complaint.status
    }), 200
