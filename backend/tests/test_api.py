
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")

    assert response.status_code == 200


def test_health_endpoint():
    response = client.get("/api/health")

    assert response.status_code == 200


def test_analyze_valid_code():
    response = client.post(
        "/api/analyze",
        json={
            "code": "def add(a, b): return a + b",
            "language": "python"
        }
    )

    assert response.status_code == 200
    assert response.json()["valid"] is True


def test_analyze_syntax_error():
    response = client.post(
        "/api/analyze",
        json={
            "code": "def add(a, b)",
            "language": "python"
        }
    )

    assert response.status_code == 200
    assert response.json()["valid"] is False


def test_analyze_empty_code():
    response = client.post(
        "/api/analyze",
        json={
            "code": "",
            "language": "python"
        }
    )

    assert response.status_code == 422
