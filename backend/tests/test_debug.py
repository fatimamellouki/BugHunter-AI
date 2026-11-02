
from fastapi.testclient import TestClient
from app.main import app
from app import main

client = TestClient(app)


def test_debug_success(monkeypatch):
    def fake_analyze_with_llm(source_code, issues):
        return {
            "explanation": "Une division par zéro est détectée.",
            "root_causes": ["Le dénominateur est nul."],
            "corrected_code": "def divide(a, b): return a / b",
            "tests": ["def test_divide(): assert 10 / 2 == 5"]
        }

    monkeypatch.setattr(
        main,
        "analyze_with_llm",
        fake_analyze_with_llm
    )

    response = client.post(
        "/api/debug",
        json={
            "code": "def divide(a, b): return a / 0",
            "language": "python"
        }
    )

    data = response.json()

    assert response.status_code == 200
    assert data["ai_status"] == "success"
    assert data["explanation"] is not None
    assert data["corrected_code"] is not None
    assert len(data["tests"]) > 0


def test_debug_invalid_syntax():
    response = client.post(
        "/api/debug",
        json={
            "code": "def divide(a, b)",
            "language": "python"
        }
    )

    data = response.json()

    assert response.status_code == 200
    assert data["valid"] is False
    assert data["ai_status"] == "skipped"


def test_debug_ai_failure(monkeypatch):
    def fake_analyze_with_llm(source_code, issues):
        raise Exception("Groq unavailable")

    monkeypatch.setattr(
        main,
        "analyze_with_llm",
        fake_analyze_with_llm
    )

    response = client.post(
        "/api/debug",
        json={
            "code": "def add(a, b): return a + b",
            "language": "python"
        }
    )

    data = response.json()

    assert response.status_code == 200
    assert data["valid"] is True
    assert data["ai_status"] == "error"
    assert data["ai_error"] is not None
