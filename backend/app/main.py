from fastapi import FastAPI

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