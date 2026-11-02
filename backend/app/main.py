import logging

from app.schemas import DebugResponse
from app.services.llm_service import analyze_with_llm
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.ast_analyzer import analyze_python_code
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
@app.post("/api/analyze", response_model=CodeAnalysisResponse)
def analyze_code(request: CodeAnalysisRequest):
    return analyze_python_code(request.code)


@app.post("/api/debug", response_model=DebugResponse)
def debug_code(request: CodeAnalysisRequest):

    # 1. Analyse statique avec AST
    analysis = analyze_python_code(request.code)

    # 2. Si la syntaxe est invalide, ne pas appeler Groq
    if not analysis["valid"]:
        return {
            **analysis,
            "ai_status": "skipped",
            "explanation": "Impossible d'analyser le code avec l'IA à cause de l'erreur de syntaxe.",
        }

    # 3. Analyse complémentaire avec Groq
    try:
        ai_result = analyze_with_llm(
            request.code,
            analysis["issues"]
        )

        return {
            **analysis,
            **ai_result,
            "ai_status": "success",
        }

    except Exception:
        logging.exception("Erreur lors de l'analyse Groq")

        return {
            **analysis,
            "ai_status": "error",
            "ai_error": "Le service IA est temporairement indisponible.",
        }