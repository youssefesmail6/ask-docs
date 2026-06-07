from app.core.config import settings
from app.schemas.rag import AnswerPayload, Source


class AnswerService:
    async def answer(self, *, question: str, sources: list[Source]) -> AnswerPayload:
        if not sources:
            return AnswerPayload(
                answer="I could not find enough matching document content to answer from the uploaded knowledge base.",
                confidence=0,
            )

        if settings.answer_provider == "fake":
            return self._fake_answer(question=question, sources=sources)

        if settings.answer_provider in {"openrouter", "pydantic_openrouter"}:
            return await self._pydantic_openrouter_answer(
                question=question,
                sources=sources,
            )

        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is required when ANSWER_PROVIDER=openai")

        from pydantic_ai import Agent

        agent = Agent(
            settings.answer_model,
            output_type=AnswerPayload,
            system_prompt=(
                "You answer internal company questions using only the provided "
                "document chunks. If the chunks do not support the answer, say so. "
                "Keep the answer concise and grounded."
            ),
        )
        result = await agent.run(self._prompt(question=question, sources=sources))
        return result.output

    async def _pydantic_openrouter_answer(
        self,
        *,
        question: str,
        sources: list[Source],
    ) -> AnswerPayload:
        if not settings.openrouter_api_key:
            raise RuntimeError(
                "OPENROUTER_API_KEY is required when ANSWER_PROVIDER=openrouter"
            )

        from pydantic_ai import Agent
        from pydantic_ai.models.openrouter import OpenRouterModel
        from pydantic_ai.providers.openrouter import OpenRouterProvider

        model = OpenRouterModel(
            settings.answer_model,
            provider=OpenRouterProvider(api_key=settings.openrouter_api_key),
        )
        agent = Agent(
            model,
            output_type=AnswerPayload,
            system_prompt=(
                "You answer internal company questions using only the provided "
                "document chunks. If the chunks do not support the answer, say so. "
                "Keep answers concise and cite the source document names in plain text."
            ),
        )
        result = await agent.run(self._prompt(question=question, sources=sources))
        return result.output

    def _fake_answer(self, *, question: str, sources: list[Source]) -> AnswerPayload:
        top_source = sources[0]
        answer = (
            f"Based on {top_source.document_title}, {top_source.content} "
            f"This is the best grounded answer found for: {question}"
        )
        return AnswerPayload(answer=answer, confidence=top_source.confidence or 0.75)

    def _prompt(self, *, question: str, sources: list[Source]) -> str:
        source_text = "\n\n".join(
            f"Source {index + 1} ({source.document_title}, chunk {source.chunk_position}):\n"
            f"{source.content}"
            for index, source in enumerate(sources)
        )
        return f"Question:\n{question}\n\nSources:\n{source_text}"
