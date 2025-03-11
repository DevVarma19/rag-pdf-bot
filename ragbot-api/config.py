import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# LLM Provider (OpenAI or Mistral)
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "mistral")

# Embedding Provider
EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "llama")

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

# Models
OPENAI_MODEL = os.getenv("OPENAI_MODEL")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL")


# Pinecone Configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_CLOUD = os.getenv("PINECONE_CLOUD")
PINECONE_ENV = os.getenv("PINECONE_REGION")  # Example: "us-east1-gcp"
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
VECTOR_DB_DIMENSION = os.getenv("VECTOR_DB_DIMENSION", 384)

# File Storage Directory
UPLOAD_DIR = "uploads"

# Chunking Parameters
CHUNK_SIZE = 1024
OVERLAP = 100

# FastAPI Settings
ALLOWED_ORIGINS = ["http://localhost:3000"]  # Update with frontend deployment URL
# Frontend URL for CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")  # Default to local frontend
