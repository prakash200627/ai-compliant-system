from app.extensions import db
from datetime import datetime, timezone

def utcnow_naive() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

class Complaint(db.Model):
    __tablename__ = 'complaint'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), index=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    category = db.Column(db.String(50), index=True)
    priority = db.Column(db.String(20), index=True)
    confidence = db.Column(db.Float)
    status = db.Column(db.String(20), default="open", index=True)
    
    created_at = db.Column(db.DateTime, default=utcnow_naive, index=True)
    updated_at = db.Column(db.DateTime, default=utcnow_naive, onupdate=utcnow_naive, nullable=False)
