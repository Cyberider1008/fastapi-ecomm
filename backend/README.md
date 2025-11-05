# Backend (FastAPI)

## Setup

- Create venv
```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

## Run

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

- API docs: http://localhost:8000/docs
- Uploaded photos served at `/uploads/*`

## Env
- `DATABASE_URL` (default sqlite:///backend/data.db)
- `JWT_SECRET`
- `ACCESS_TOKEN_EXPIRE_MINUTES` (default 60)

