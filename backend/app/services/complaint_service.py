from app.extensions import db
from app.models.complaint import Complaint
from app.services.ai_service import analyze_complaint
from app.services.escalation_service import escalate_complaint
from app.services.status_service import is_valid_transition

class ComplaintService:
    @staticmethod
    def create_complaint(user_id, title, description):
        analysis = analyze_complaint(f"{title} {description}")
        
        complaint = Complaint(
            user_id=user_id,
            title=title,
            description=description,
            category=analysis["category"],
            priority=analysis["priority"],
            confidence=analysis.get("confidence", 0.0),
            status="open"
        )
        
        db.session.add(complaint)
        db.session.flush()
        
        if analysis["priority"] == "high" and analysis.get("confidence", 0) >= 0.6:
            escalate_complaint(
                complaint,
                reason="High confidence AI escalation"
            )
            
        db.session.commit()
        return complaint, analysis

    @staticmethod
    def get_user_complaints(user_id):
        return Complaint.query.filter_by(user_id=user_id).all()

    @staticmethod
    def update_complaint_status(complaint_id, new_status):
        complaint = db.session.get(Complaint, complaint_id)
        if not complaint:
            return None, "Complaint not found"
            
        if not is_valid_transition(complaint.status, new_status):
            return None, "Invalid status transition"
            
        complaint.status = new_status
        db.session.commit()
        return complaint, None
