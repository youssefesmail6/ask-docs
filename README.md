# AskDocs AI

AskDocs AI is an internal company RAG assistant built with React, Rails API, FastAPI, PostgreSQL, pgvector, PydanticAI, and OpenAI-ready service boundaries.

There is intentionally no authentication. Rails seeds one Admin user and one Employee user; the frontend lets you enter either workspace.

## Run

```powershell
docker compose up -d
```

Rails:

```powershell
cd backend
bundle install
bundle exec rails db:prepare
bundle exec rails server -p 3000
```

AI service:

```powershell
cd ai_service
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --port 8001
```

Frontend:

```powershell
npm install
npm run dev --workspace frontend
```

Open `http://localhost:5173/enter`.

