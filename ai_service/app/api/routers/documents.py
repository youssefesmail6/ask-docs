from uuid import UUID

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.rag import DocumentUploadResponse
from app.services.rag_pipeline import RagPipeline
from app.services.repository import RagRepository


router = APIRouter(prefix="/documents", tags=["documents"])


def get_pipeline() -> RagPipeline:
    return RagPipeline()


@router.post("", response_model=DocumentUploadResponse)
async def upload_document(
    document_id: UUID | None = Form(default=None),
    title: str = Form(...),
    filename: str = Form(default="document.txt"),
    content: str | None = Form(default=None),
    file: UploadFile | None = File(default=None),
):
    try:
        return await get_pipeline().ingest_document(
            document_id=document_id,
            title=title,
            filename=filename,
            content=content,
            upload_file=file,
        )
    except Exception as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@router.delete("/{document_id}")
def delete_document(document_id: UUID):
    RagRepository().delete_document(document_id)
    return {"deleted": True}
