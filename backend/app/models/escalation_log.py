from app.extensions import db
from datetime import datetime, timezone

def utcnow_naive() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

class EscalationLog(db.Model):
    __tablename__ = 'escalation_log'

    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey("complaint.id"), index=True)
    from_level = db.Column(db.String(50))
    to_level = db.Column(db.String(50))
    reason = db.Column(db.String(255))
    
    timestamp = db.Column(db.DateTime, default=utcnow_naive, index=True)
    updated_at = db.Column(db.DateTime, default=utcnow_naive, onupdate=utcnow_naive, nullable=False)
