import pytest

from app import create_app
from app.extensions import db


from config import TestingConfig


@pytest.fixture()
def app():
    app = create_app(config_class=TestingConfig)
    app.config.update({"TESTING": True})

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def _register(client, email="user@example.com", password="pass1234", name="User"):
    return client.post(
        "/auth/register",
        json={"name": name, "email": email, "password": password},
    )


def _login(client, email="user@example.com", password="pass1234"):
    return client.post(
        "/auth/login",
        json={"email": email, "password": password},
    )


@pytest.fixture()
def auth_header(client):
    _register(client)
    res = _login(client)
    token = res.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def admin_header(client):
    # Register + login
    _register(client, email="admin@example.com")
    res = _login(client, email="admin@example.com")
    token = res.get_json()["access_token"]

    # Promote self to admin (your current endpoint allows this)
    client.post("/auth/make-admin", headers={"Authorization": f"Bearer {token}"})

    return {"Authorization": f"Bearer {token}"}
