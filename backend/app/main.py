
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