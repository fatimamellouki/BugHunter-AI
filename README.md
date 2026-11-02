# BugHunter AI 🐛

**An AI-powered Python code analysis and debugging assistant.**

BugHunter AI is an intelligent application designed to help developers identify, understand, and fix potential bugs in Python code. It combines static code analysis with AI-powered explanations to make debugging easier and more efficient.
<img width="986" height="855" alt="image" src="https://github.com/user-attachments/assets/f564b996-02f2-4016-bdf2-78624ffd7b0b" />

## 🚀 Key Features

- **Bug Detection:** Identify syntax errors and potential programming issues through static analysis.
- **AI-Powered Explanations:** Understand why an issue occurs and how it affects the code.
- **Root Cause Analysis:** Get possible explanations for the origin of detected issues.
- **Code Correction Suggestions:** Receive suggested corrected versions of problematic code.
- **Pytest Test Generation:** Generate unit test suggestions to help verify code behavior.
- **Interactive Interface:** Analyze Python code through a user-friendly web interface.
  <img width="1128" height="622" alt="image" src="https://github.com/user-attachments/assets/cacb7f4d-495c-4c82-af40-94fcd3e1f3c6" />

<img width="1007" height="861" alt="image" src="https://github.com/user-attachments/assets/f8943b45-9233-4c5f-9aee-d85f90e458b5" />

## 🏗️ Architecture

BugHunter AI consists of two main components:

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Python, FastAPI |
| AI Integration | Large Language Models (LLMs) |
| Static Analysis | Python |
| Testing | Pytest |
| Version Control | Git, GitHub |

## 📁 Project Structure

```text
BugHunter-AI/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── services/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.11 or later
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/fatimamellouki/BugHunter-AI.git
cd BugHunter-AI
```

### 2. Set up the backend

```bash
cd backend

python -m venv .venv
```

Activate the virtual environment:

**Windows:**
```powershell
.\.venv\Scripts\Activate.ps1
```

**Linux / macOS:**
```bash
source .venv/bin/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Configure the required environment variables in a `.env` file according to the backend configuration. Never commit API keys or secrets.

Start the FastAPI server:

```bash
python -m uvicorn app.main:app --reload
```

Backend API documentation:

http://127.0.0.1:8000/docs

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend

npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔄 How It Works

1. The user submits Python code through the frontend.
2. The frontend sends the code to the FastAPI backend.
3. The backend performs static analysis to identify potential issues.
4. The AI service provides explanations, possible root causes, correction suggestions, and Pytest test drafts.
5. The results are returned to the frontend and displayed to the user.

**Important:** Static analysis identifies the reported issues. AI-generated explanations and suggestions are intended to assist developers and should be reviewed before applying them.

## 👥 Team

- **Fatima Mellouki**
- **Fadwa ERRAMI**

## 🛠️ Development Workflow

The project uses Git and GitHub for collaborative development.

- `main`: Stable version of the project.
- `develop`: Main integration branch for development.
- `feature/*`: Individual feature development.
- `test/integration`: Frontend and backend integration testing.

## 🎯 Project Objective

Our goal is to make Python debugging more accessible by combining traditional static analysis with AI assistance, helping developers understand programming errors and improve code quality.
## 📬 Contact

For questions, suggestions, or collaboration opportunities, feel free to contact us:

**Fatima Mellouki**
- GitHub: [@fatimamellouki](https://github.com/fatimamellouki)
- Email: fatimamellouki307@gmail.com || fatima.mellouki1@usmba.ac.ma

**Fadwa ERRAMI**
- GitHub: [@fadaerrami]([https://github.com/](https://github.com/FadwaErrami)
- Email:fadwaerrami4@gmail.com || fadwa.errami@usmba.ac.ma

**BugHunter AI — Detect. Understand. Fix.**
