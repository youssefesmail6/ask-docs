import psycopg
from psycopg.rows import dict_row

from app.core.config import settings


def get_connection():
    return psycopg.connect(settings.ai_database_url, row_factory=dict_row)
