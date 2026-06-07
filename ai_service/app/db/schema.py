from app.core.config import settings
from app.db.session import get_connection


def init_db() -> None:
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS vector")
            reset_incompatible_dev_schema(cursor)
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS documents (
                  id uuid PRIMARY KEY,
                  title text NOT NULL,
                  filename text NOT NULL,
                  status text NOT NULL DEFAULT 'processing',
                  created_at timestamptz NOT NULL DEFAULT now(),
                  updated_at timestamptz NOT NULL DEFAULT now()
                )
                """
            )
            cursor.execute(
                f"""
                CREATE TABLE IF NOT EXISTS chunks (
                  id uuid PRIMARY KEY,
                  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
                  content text NOT NULL,
                  position integer NOT NULL,
                  embedding vector({settings.embedding_dimension}) NOT NULL,
                  created_at timestamptz NOT NULL DEFAULT now()
                )
                """
            )
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS jobs (
                  id uuid PRIMARY KEY,
                  document_id uuid NOT NULL,
                  status text NOT NULL,
                  error text,
                  chunks_count integer NOT NULL DEFAULT 0,
                  created_at timestamptz NOT NULL DEFAULT now(),
                  updated_at timestamptz NOT NULL DEFAULT now()
                )
                """
            )
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS query_logs (
                  id uuid PRIMARY KEY,
                  document_id uuid,
                  question text NOT NULL,
                  answer text NOT NULL,
                  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
                  created_at timestamptz NOT NULL DEFAULT now()
                )
                """
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS index_chunks_on_document_id ON chunks(document_id)"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS index_chunks_on_document_position ON chunks(document_id, position)"
            )
            cursor.execute("ALTER TABLE query_logs ALTER COLUMN document_id DROP NOT NULL")
        connection.commit()


def reset_incompatible_dev_schema(cursor) -> None:
    document_id_type = column_type(cursor, "documents", "id")

    if document_id_type and document_id_type != "uuid":
        cursor.execute("DROP TABLE IF EXISTS query_logs CASCADE")
        cursor.execute("DROP TABLE IF EXISTS chunks CASCADE")
        cursor.execute("DROP TABLE IF EXISTS jobs CASCADE")
        cursor.execute("DROP TABLE IF EXISTS documents CASCADE")


def column_type(cursor, table_name: str, column_name: str) -> str | None:
    cursor.execute(
        """
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = %s
          AND column_name = %s
        """,
        (table_name, column_name),
    )
    row = cursor.fetchone()
    return row["data_type"] if row else None
