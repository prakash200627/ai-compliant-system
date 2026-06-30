def test_create_complaint_requires_auth(client):
    res = client.post("/complaints", json={"title": "t", "description": "d"})
    assert res.status_code in (401, 422)


def test_create_and_list_my_complaints(client, auth_header):
    res = client.post(
        "/complaints",
        headers=auth_header,
        json={"title": "Internet down", "description": "Wifi not working"},
    )
    assert res.status_code == 201
    body = res.get_json()
    assert body["complaint_id"]
    assert body["priority"]
    assert body["category"]

    res = client.get("/complaints/my", headers=auth_header)
    assert res.status_code == 200
    items = res.get_json()
    assert isinstance(items, list)
    assert len(items) == 1
    assert items[0]["title"] == "Internet down"
