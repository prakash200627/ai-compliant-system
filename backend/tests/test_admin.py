def test_admin_update_status_flow(client, admin_header, auth_header):
    # Create a complaint as normal user
    res = client.post(
        "/complaints",
        headers=auth_header,
        json={"title": "Fee issue", "description": "Refund pending"},
    )
    assert res.status_code == 201
    complaint_id = res.get_json()["complaint_id"]

    # Admin moves open -> in_progress
    res = client.put(
        f"/api/admin/complaints/{complaint_id}/status",
        headers=admin_header,
        json={"status": "in_progress"},
    )
    assert res.status_code == 200
    assert res.get_json()["status"] == "in_progress"

    # Invalid transition in_progress -> open should fail
    res = client.put(
        f"/api/admin/complaints/{complaint_id}/status",
        headers=admin_header,
        json={"status": "open"},
    )
    assert res.status_code == 400
