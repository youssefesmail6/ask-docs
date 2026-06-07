from fastapi import APIRouter, HTTPException

from app.schemas.rag import QueryRequest, QueryResponse
from app.services.rag_pipeline import RagPipeline


router = APIRouter(prefix="/query", tags=["query"])


@router.post("", response_model=QueryResponse)
async def query_documents(payload: QueryRequest):
    try:
        return await RagPipeline().query(
            document_id=payload.document_id,
            question=payload.question,
        )
    except Exception as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
