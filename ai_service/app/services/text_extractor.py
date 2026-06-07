from io import BytesIO

from fastapi import UploadFile


class TextExtractor:
    async def extract(self, *, upload_file: UploadFile | None, content: str | None) -> str:
        if content and content.strip():
            return content

        if upload_file is None:
            return ""

        raw_bytes = await upload_file.read()
        filename = (upload_file.filename or "").lower()

        if filename.endswith(".pdf"):
            return self._extract_pdf(raw_bytes)

        return raw_bytes.decode("utf-8", errors="ignore")

    def _extract_pdf(self, raw_bytes: bytes) -> str:
        try:
            from pypdf import PdfReader
        except ModuleNotFoundError as error:
            raise RuntimeError(
                "PDF upload requires pypdf. Install it with: python -m pip install pypdf"
            ) from error

        reader = PdfReader(BytesIO(raw_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages)
