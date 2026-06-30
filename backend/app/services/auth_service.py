from flask_jwt_extended import get_jwt_identity
from app.extensions import db, bcrypt
from app.models.user import User
from flask_jwt_extended import create_access_token

def get_current_user():
    user_id = get_jwt_identity()
    if user_id is None:
        return None
    return db.session.get(User, int(user_id))

def user_has_role(user, *roles):
    return user and user.role in roles

class AuthService:
    @staticmethod
    def register_user(name, email, password, role="user"):
        if User.query.filter_by(email=email).first():
            return None, "email already registered"
            
        hashed_password = bcrypt.generate_password_hash(password, rounds=12).decode('utf-8')
        user = User(
            name=name or "User",
            email=email,
            password=hashed_password,
            role=role
        )
        db.session.add(user)
        db.session.commit()
        return user, None

    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not user.password or not bcrypt.check_password_hash(user.password, password):
            return None, "Invalid credentials"
            
        token = create_access_token(identity=str(user.id))
        return token, None

    @staticmethod
    def dev_login(email):
        user = User.query.filter_by(email=email).first()
        if not user:
            hashed_password = bcrypt.generate_password_hash("password", rounds=12).decode('utf-8')
            user = User(name="Test User", email=email, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            
        token = create_access_token(identity=str(user.id))
        return token
