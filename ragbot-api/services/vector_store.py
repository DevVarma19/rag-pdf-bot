import os
import uuid
import numpy as np
from pinecone import Pinecone, ServerlessSpec
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core.indices.vector_store.base import VectorStoreIndex
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.schema import Document
from services.embedding_service import get_embedding_model

from config import PINECONE_API_KEY, PINECONE_ENV, PINECONE_CLOUD, PINECONE_INDEX_NAME, VECTOR_DB_DIMENSION

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# check for index
if PINECONE_INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=VECTOR_DB_DIMENSION,
        metric='cosine',
        spec=ServerlessSpec(cloud=PINECONE_CLOUD, region=PINECONE_ENV)
    )

index = pc.Index(PINECONE_INDEX_NAME)

print(pc.describe_index(PINECONE_INDEX_NAME))

# Initialize LlamaIndex Vector Store
vector_store = PineconeVectorStore(pinecone_index=index)
vector_index = VectorStoreIndex.from_vector_store(vector_store)
retriever = VectorIndexRetriever(index=vector_index, similarity_top_k=5)
query_engine = RetrieverQueryEngine(retriever=retriever)

def cosine_similarity(vec1, vec2):
    """Computes cosine similarity between two vectors."""
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def store_vectors_in_pinecone(text_chunks, doc_id):
    """
        Stores document chunks and embeddings in Pinecone using the selected embedding model.
    """
    # Insert nodes into the vector index
    try:
        embed_model = get_embedding_model()
        print(f"[INFO] Using Embedding Model: {embed_model}")  # Debug log

        # Convert text chunks into LlamaIndex Document objects
        entries = []
        for i in range(len(text_chunks)):
            chunk = text_chunks[i]
            vector = embed_model.get_text_embedding(chunk)
            entries.append(
                {"id": str(uuid.uuid4()), "values": vector, "metadata": {"text": chunk, "doc_id": doc_id, "chunk_id": i}}
            )
        index.upsert(entries)
    except Exception as e:
        raise ValueError(f"Failed to store vectors in Pinecone: {e}")

def search_vectors_in_pinecone(query, top_k=5, embed_model=None):
    """
        Performs a similarity search in Pinecone and returns the most relevant document chunks.
    """
    if not embed_model:
        raise ValueError("Embedding model is required for vector search.")
    try:
        # Query the vector store
        query_engine = RetrieverQueryEngine(retriever=retriever)
        # Query vector DB
        answer = retriever.retrieve(query)
        contents = [i.get_content() for i in answer]
        
        return contents
    except Exception as e:
        raise ValueError(f"Failed to search vectors in Pinecone: {e}")

def list_documents_in_pinecone():
    """
        Fetches all document IDs stored in Pinecone.
    """
    index_stats = index.describe_index_stats()
    return list(index_stats.get("namespaces", {}).keys()) if "namespaces" in index_stats else []