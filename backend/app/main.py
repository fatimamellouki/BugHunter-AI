
from fastapi import FastAPI
from app.schemas import (
    CodeAnalysisRequest,
    CodeAnalysisResponse,
    SeverityEnum
)

app = FastAPI(
    title="BugHunter AI",
    description="AI-powered Python debugging assistant",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to BugHunter AI!"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "OK",
        "message": "BugHunter AI backend is running"
    }


@app.post("/api/analyze", response_model=CodeAnalysisResponse)
def analyze_code(request: CodeAnalysisRequest):
    # Simulation temporaire : le véritable analyseur AST
    # sera développé dans une prochaine étape.
    return {
        "status": "success",
        "valid": True,
        "summary": "1 problème potentiel détecté (simulation).",
        "issues": [
            {
                "rule_id": "SIMULATION_01",
                "type": "ExampleIssue",
                "line": 1,
                "severity": SeverityEnum.LOW,
                "message": "Ceci est une fausse alerte pour tester le schéma."
            }
        ]
    }
