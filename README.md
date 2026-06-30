# AI Complaint System

REST API for complaints with user registration and JWT auth.

## Local Access

- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Frontend App:** [http://localhost:5173](http://localhost:5173)

## Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
Open http://localhost:5173

## Tech Stack

- Backend: Python Flask 3.1.2
- Database: SQLite (Development), PostgreSQL 15 (Production ready)

## Prerequisites

- Python 3.11+
- SQLite or PostgreSQL 15+

## Getting Started

```bash
git clone [repo]
cd ai-complaint-system/backend
cp .env.example .env
# fill in .env values
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
pytest tests/
python run.py
```

## Environment Variables

| Variable        | Description          | Example                                      |
| --------------- | -------------------- | -------------------------------------------- |
| DATABASE_URL    | DB connection string | postgresql://user:pass@localhost:5432/dbname |
| SECRET_KEY      | App secret key       | your-secret-key                              |
| JWT_SECRET_KEY  | JWT signing secret   | your-jwt-secret                              |
| LOG_LEVEL       | Logging level        | INFO                                         |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:3000                        |

## API Endpoints

| Method | Route                  | Description       | Auth        |
| ------ | ---------------------- | ----------------- | ----------- |
| GET    | /health                | Health check      | No          |
| POST   | /auth/register         | Register user     | No          |
| POST   | /auth/login            | Login user        | No          |
| POST   | /complaints            | Create complaint  | Yes         |
| GET    | /complaints/my         | Get my complaints | Yes         |
| GET    | /api/admin/escalations | View escalations  | Yes (Admin) |

## Running Tests

```bash
cd ai-complaint-system/backend
pip install -r requirements-dev.txt
pytest tests/ -v --coverage
```

## Folder Structure

```
ai-complaint-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── extensions.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── .env.example
│   ├── .gitignore
│   ├── config.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── run.py
└── frontend/
    ├── src/
    ├── index.html
    ├── package.json
    └── vite.config.js
```
