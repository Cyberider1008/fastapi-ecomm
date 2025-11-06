# Backend (FastAPI)

## Setup

- Create venv
```bash
python -m venv .venv
. .venv/Scripts/activate 
pip install -r backend/requirements.txt
```

## Run

```bash
uvicorn backend.app.main:app --reload 
```


## Env
- `DATABASE_URL` (default sqlite:///backend/data.db)
- `JWT_SECRET`
- `ACCESS_TOKEN_EXPIRE_MINUTES` (default 60)

