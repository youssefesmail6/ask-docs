from uuid import UUID, uuid4

from fastapi import UploadFile

from app.core.config import settings
from app.schemas.rag import DocumentUploadResponse, QueryResponse, Source
from app.services.answer_service import AnswerService
from app.services.chunker import Chunker
from app.services.embedding_service import EmbeddingService
from app.services.repository import RagRepository
from app.services.text_cleaner import TextCleaner
from app.services.text_extractor import TextExtractor


class RagPipeline:
    def __init__(self) -> None:
        self.repository = RagRepository()
        self.extractor = TextExtractor()
        self.cleaner = TextCleaner()
        self.chunker = Chunker()
        self.embedding_service = EmbeddingService()
        self.answer_service = AnswerService()

    async def ingest_document(
        self,
        *,
        document_id: UUID | None,
        title: str,
        filename: str,
        content: str | None,
        upload_file: UploadFile | None,
    ) -> DocumentUploadResponse:
        document_id = document_id or uuid4()
        job_id = uuid4()
        self.repository.create_job(job_id=job_id, document_id=document_id, status="processing")

        try:
            raw_text = await self.extractor.extract(upload_file=upload_file, content=content)
            clean_text = self.cleaner.clean(raw_text)
            chunks = self.chunker.chunk(clean_text)

            if not chunks:
                raise ValueError("No extractable text was found in this document")

            embeddings = []
            for chunk in chunks:
                embeddings.append(await self.embedding_service.embed(chunk))

            self.repository.upsert_document(
                document_id=document_id,
                title=title,
                filename=filename,
                status="ready",
            )
            self.repository.replace_chunks(
                document_id=document_id,
                chunks=chunks,
                embeddings=embeddings,
            )
            self.repository.update_job(
                job_id=job_id,
                status="ready",
                chunks_count=len(chunks),
            )

            return DocumentUploadResponse(
                job_id=job_id,
                document_id=document_id,
                status="ready",
            )
        except Exception as error:
            self.repository.upsert_document(
                document_id=document_id,
                title=title,
                filename=filename,
                status="failed",
            )
            self.repository.update_job(
                job_id=job_id,
                status="failed",
                error=str(error),
            )
            raise

    async def query(self, *, document_id: UUID | None, question: str) -> QueryResponse:
        question_embedding = await self.embedding_service.embed(question)
        rows = self.repository.search_chunks(
            document_id=document_id,
            question_embedding=question_embedding,
            limit=settings.top_k,
        )
        sources = [self._source_from_row(row) for row in rows]
        answer = await self.answer_service.answer(question=question, sources=sources)
        serialized_sources = [source.model_dump(mode="json") for source in sources]

        self.repository.log_query(
            document_id=document_id or (sources[0].document_id if sources else None),
            question=question,
            answer=answer.answer,
            sources=serialized_sources,
        )

        return QueryResponse(
            answer=answer.answer,
            sources=sources,
            confidence=answer.confidence,
        )

    def _source_from_row(self, row: dict) -> Source:
        distance = float(row["distance"])
        confidence = 1 / (1 + max(distance, 0))
        return Source(
            document_id=row["document_id"],
            document_title=row["document_title"],
            chunk_id=row["chunk_id"],
            chunk_position=row["chunk_position"],
            content=row["content"],
            score=distance,
            confidence=confidence,
        )
