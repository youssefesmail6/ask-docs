from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import documents, jobs, query
from app.core.config import settings
from app.db.schema import init_db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="AskDocs AI Service",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(query.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/debug/config")
def debug_config():
    return {
        "use_fake_ai": settings.use_fake_ai,
        "use_fake_embeddings": settings.use_fake_embeddings,
        "answer_provider": settings.answer_provider,
        "answer_model": settings.answer_model,
        "has_openrouter_key": bool(settings.openrouter_api_key),
    }
