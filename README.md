# AskDocs AI

AskDocs AI is an internal company document assistant built with a Retrieval-Augmented Generation architecture. It allows users to upload company documents, process them into searchable knowledge, and ask questions with answers grounded in the uploaded content.

The project uses a microservice structure that separates the main Rails API from a Python FastAPI AI service. This keeps document management, chat logic, embeddings, and LLM response generation clearly separated.

## Key Features

* **Document Upload & Processing**
  Upload company documents and prepare them for semantic search through extraction, cleaning, chunking, and embedding generation.

* **RAG-Based Question Answering**
  Uses Retrieval-Augmented Generation to retrieve relevant document chunks before generating answers, helping responses stay grounded in company content.

* **Semantic Search with pgvector**
  Stores document embeddings in PostgreSQL using the pgvector extension and performs vector similarity search to find relevant source context.

* **Rails + FastAPI Microservice Architecture**
  Rails handles the main backend API and application logic, while FastAPI manages AI-specific operations such as embeddings, retrieval, and LLM response generation.

* **Structured AI Responses with PydanticAI**
  Uses PydanticAI to return structured answer payloads with fields such as answer content, confidence level, and source references.

* **Internal Workspace Flow**
  Rails seeds an Admin user and an Employee user. The frontend allows entering either workspace for testing and internal usage.

## Tech Stack

**Frontend:** React
**Backend API:** Ruby on Rails API
**AI Service:** Python, FastAPI
**Database:** PostgreSQL, pgvector
**AI / RAG:** PydanticAI, embeddings, vector similarity search
**Infrastructure:** Docker Compose
**Communication:** Rails service-to-service requests to the FastAPI AI service

## Project Structure

```bash
askdocs-ai/
├── backend/              # Ruby on Rails API
│   ├── app/
│   ├── config/
│   ├── db/
│   └── Gemfile
│
├── ai_service/           # Python FastAPI AI/RAG service
│   ├── app/
│   ├── requirements.txt
│   └── main.py
│
├── frontend/             # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

## How It Works

1. HR or other company departments upload internal documents such as policies, procedures, guides, and knowledge base content.
2. Rails manages document storage and coordinates the document processing workflow.
3. The AI service extracts text from the uploaded documents and prepares it for retrieval.
4. The content is divided into smaller chunks and converted into vector embeddings.
5. Embeddings are stored in PostgreSQL using pgvector to enable semantic search.
6. When an employee asks a question, the system performs a semantic similarity search to find the most relevant document chunks.
7. The retrieved company knowledge is provided as context to the LLM.
8. The AI service generates an answer grounded in the uploaded company documents and returns the response along with relevant source references.

## Running the Project

Start the required services:

```bash
docker compose up -d
```

### Rails Backend

```bash
cd backend
bundle install
bundle exec rails db:prepare
bundle exec rails server -p 3000
```

### AI Service

```bash
cd ai_service
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --port 8001
```

### Frontend

```bash
npm install
npm run dev --workspace frontend
```

Open the application:

```bash
http://localhost:5173/enter
```

## Notes

This version is designed as an internal company assistant and local development project. Authentication is intentionally not included. Rails seeds one Admin user and one Employee user for testing different workspace flows.

## Main Goal

The goal of AskDocs AI is to provide companies with a self-hosted document question-answering system where employees can ask questions and receive answers based on internal documents instead of relying only on general AI knowledge.
