from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.schemas.rag import JobStatusResponse
from app.services.repository import RagRepository


router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/{job_id}", response_model=JobStatusResponse)
def show_job(job_id: UUID):
    job = RagRepository().get_job(job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "job_id": job["id"],
        "document_id": job["document_id"],
        "status": job["status"],
        "chunks_count": job["chunks_count"],
        "error": job["error"],
        "created_at": job["created_at"],
        "updated_at": job["updated_at"],
    }
