import hashlib
import math
import re

from app.core.config import settings


class EmbeddingService:
    def __init__(self) -> None:
        self.client = None
        if not settings.use_fake_embeddings:
            from openai import AsyncOpenAI

            self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def embed(self, text: str) -> list[float]:
        if settings.use_fake_embeddings:
            return self._fake_embedding(text)

        if not settings.openai_api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is required when USE_FAKE_EMBEDDINGS=false"
            )

        response = await self.client.embeddings.create(
            model=settings.embedding_model,
            input=text,
        )
        return list(response.data[0].embedding)

    def _fake_embedding(self, text: str) -> list[float]:
        tokens = set(re.findall(r"[a-z0-9]+", text.lower()))
        if not tokens:
            tokens = {text.lower()}

        values = [0.0] * settings.embedding_dimension

        for token in tokens:
            seed = hashlib.sha256(token.encode("utf-8")).digest()

            for index in range(settings.embedding_dimension):
                digest = hashlib.sha256(seed + index.to_bytes(4, "big")).digest()
                raw = int.from_bytes(digest[:4], "big") / 2**32
                values[index] += (raw * 2) - 1

        norm = math.sqrt(sum(value * value for value in values)) or 1
        return [value / norm for value in values]
