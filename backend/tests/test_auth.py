def test_register_and_login(client):
    res = client.post(
        "/auth/register",
        json={"name": "Alice", "email": "alice@example.com", "password": "pass1234"},
    )
    assert res.status_code == 201

    res = client.post(
        "/auth/login",
        json={"email": "alice@example.com", "password": "pass1234"},
    )
    assert res.status_code == 200
    data = res.get_json()
    assert "access_token" in data


def test_login_invalid_credentials(client):
    # Not registered
    res = client.post(
        "/auth/login",
        json={"email": "missing@example.com", "password": "nope"},
    )
    assert res.status_code == 401
