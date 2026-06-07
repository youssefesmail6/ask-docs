from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class Source(BaseModel):
    document_id: UUID
    document_title: str
    chunk_id: UUID
    chunk_position: int
    content: str
    score: float | None = None
    confidence: float | None = None


class DocumentUploadResponse(BaseModel):
    job_id: UUID
    document_id: UUID
    status: str


class JobStatusResponse(BaseModel):
    job_id: UUID
    document_id: UUID
    status: str
    chunks_count: int = 0
    error: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class QueryRequest(BaseModel):
    document_id: UUID | None = None
    question: str = Field(min_length=1)


class QueryResponse(BaseModel):
    answer: str
    sources: list[Source]
    confidence: float | None = None


class AnswerPayload(BaseModel):
    answer: str
    confidence: float = Field(ge=0, le=1)
