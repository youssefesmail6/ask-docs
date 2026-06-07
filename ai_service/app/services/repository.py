import json
from uuid import UUID, uuid4

from app.db.session import get_connection


def _vector_literal(embedding: list[float]) -> str:
    return "[" + ",".join(f"{value:.8f}" for value in embedding) + "]"


class RagRepository:
    def create_job(self, *, job_id: UUID, document_id: UUID, status: str) -> None:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO jobs (id, document_id, status)
                    VALUES (%s, %s, %s)
                    """,
                    (job_id, document_id, status),
                )
            connection.commit()

    def update_job(
        self,
        *,
        job_id: UUID,
        status: str,
        chunks_count: int = 0,
        error: str | None = None,
    ) -> None:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE jobs
                    SET status = %s,
                        chunks_count = %s,
                        error = %s,
                        updated_at = now()
                    WHERE id = %s
                    """,
                    (status, chunks_count, error, job_id),
                )
            connection.commit()

    def get_job(self, job_id: UUID) -> dict | None:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
                return cursor.fetchone()

    def upsert_document(
        self,
        *,
        document_id: UUID,
        title: str,
        filename: str,
        status: str,
    ) -> None:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO documents (id, title, filename, status)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE
                    SET title = EXCLUDED.title,
                        filename = EXCLUDED.filename,
                        status = EXCLUDED.status,
                        updated_at = now()
                    """,
                    (document_id, title, filename, status),
                )
            connection.commit()

    def mark_document_status(self, *, document_id: UUID, status: str) -> None:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE documents
                    SET status = %s,
                        updated_at = now()
                    WHERE id = %s
                    """,
                    (status, document_id),
                )
            connection.commit()

    def replace_chunks(
        self,
        *,
        document_id: UUID,
        chunks: list[str],
        embeddings: list[list[float]],
    ) -> None:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM chunks WHERE document_id = %s", (document_id,))

                for position, (content, embedding) in enumerate(zip(chunks, embeddings)):
                    cursor.execute(
                        """
                        INSERT INTO chunks (id, document_id, content, position, embedding)
                        VALUES (%s, %s, %s, %s, %s::vector)
                        """,
                        (
                            uuid4(),
                            document_id,
                            content,
                            position,
                            _vector_literal(embedding),
                        ),
                    )
            connection.commit()

    def search_chunks(
        self,
        *,
        document_id: UUID | None,
        question_embedding: list[float],
        limit: int,
    ) -> list[dict]:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                vector = _vector_literal(question_embedding)
                if document_id:
                    cursor.execute(
                        """
                        SELECT
                          chunks.id AS chunk_id,
                          chunks.document_id,
                          chunks.content,
                          chunks.position AS chunk_position,
                          documents.title AS document_title,
                          (chunks.embedding <-> %s::vector) AS distance
                        FROM chunks
                        INNER JOIN documents ON documents.id = chunks.document_id
                        WHERE chunks.document_id = %s
                        ORDER BY chunks.embedding <-> %s::vector
                        LIMIT %s
                        """,
                        (vector, document_id, vector, limit),
                    )
                else:
                    cursor.execute(
                        """
                        SELECT
                          chunks.id AS chunk_id,
                          chunks.document_id,
                          chunks.content,
                          chunks.position AS chunk_position,
                          documents.title AS document_title,
                          (chunks.embedding <-> %s::vector) AS distance
                        FROM chunks
                        INNER JOIN documents ON documents.id = chunks.document_id
                        ORDER BY chunks.embedding <-> %s::vector
                        LIMIT %s
                        """,
                        (vector, vector, limit),
                    )
                return list(cursor.fetchall())

    def log_query(
        self,
        *,
        document_id: UUID | None,
        question: str,
        answer: str,
        sources: list[dict],
    ) -> None:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO query_logs (id, document_id, question, answer, sources)
                    VALUES (%s, %s, %s, %s, %s::jsonb)
                    """,
                    (uuid4(), document_id, question, answer, json.dumps(sources)),
                )
            connection.commit()

    def delete_document(self, document_id: UUID) -> None:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM documents WHERE id = %s", (document_id,))
            connection.commit()
