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
from llama_index.core.vector_stores.types import MetadataFilter, MetadataFilters

from config import PINECONE_API_KEY, PINECONE_ENV, PINECONE_CLOUD, PINECONE_INDEX_NAME, VECTOR_DB_DIMENSION

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# check for index
if PINECONE_INDEX_NAME not in pc.list_indexes().names():
    print(f"[INFO] Creating new Pinecone index: {PINECONE_INDEX_NAME}")
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=VECTOR_DB_DIMENSION,
        metric='cosine',
        spec=ServerlessSpec(cloud=PINECONE_CLOUD, region=PINECONE_ENV)
    )
    print(f"[INFO] Index {PINECONE_INDEX_NAME} created successfully")
else:
    print(f"[INFO] Using existing Pinecone index: {PINECONE_INDEX_NAME}")

index = pc.Index(PINECONE_INDEX_NAME)

# Print index statistics
index_stats = pc.describe_index(PINECONE_INDEX_NAME)
print(f"[INFO] Index statistics: {index_stats}")

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
        print(f"[INFO] Storing {len(text_chunks)} chunks for document {doc_id}")

        # Convert text chunks into LlamaIndex Document objects
        entries = []
        for i in range(len(text_chunks)):
            chunk = text_chunks[i]
            vector = embed_model.get_text_embedding(chunk)
            print(f"[DEBUG] Generated embedding for chunk {i} with dimension {len(vector)}")
            entries.append(
                {"id": str(uuid.uuid4()), "values": vector, "metadata": {"text": chunk, "doc_id": doc_id, "chunk_id": i}}
            )
        
        # Upsert entries to Pinecone
        print(f"[INFO] Upserting {len(entries)} entries to Pinecone")
        index.upsert(entries)
        
        # Verify the entries were stored
        index_stats = index.describe_index_stats()
        print(f"[INFO] Updated index statistics: {index_stats}")
        
        return True
    except Exception as e:
        print(f"[ERROR] Failed to store vectors: {str(e)}")
        raise ValueError(f"Failed to store vectors in Pinecone: {e}")

def search_vectors_in_pinecone(query, top_k=5, embed_model=None, doc_id=None, chunk_id=None):
    """
        Performs a similarity search in Pinecone and returns the most relevant document chunks.
        
        Args:
            query (str): The search query
            top_k (int): Number of results to return
            embed_model: The embedding model to use
            doc_id (str, optional): Filter results by document ID
            chunk_id (int, optional): Filter results by chunk ID
    """
    if not embed_model:
        raise ValueError("Embedding model is required for vector search.")
    try:
        # Generate embedding for the query
        query_embedding = embed_model.get_text_embedding(query)
        print(f"[DEBUG] Query embedding generated with dimension: {len(query_embedding)}")
        
        # Create filter if doc_id or chunk_id is provided
        filter_dict = {}
        if doc_id:
            filter_dict["doc_id"] = doc_id
            print(f"[INFO] Filtering by document ID: {doc_id}")
        if chunk_id is not None:
            filter_dict["chunk_id"] = chunk_id
            print(f"[INFO] Filtering by chunk ID: {chunk_id}")
        
        # Manually create a retriever with the desired top_k and filters
        temp_retriever = VectorIndexRetriever(
            index=vector_index, 
            similarity_top_k=top_k,
            filters=filter_dict if filter_dict else None
        )
        
        # Convert dict to MetadataFilters
        metadata_filters = None
        if filter_dict:
            metadata_filters = MetadataFilters(
                filters=[
                    MetadataFilter(key=k, value=v) for k, v in filter_dict.items()
                ]
            )
        
        # Create retriever with optional filters
        temp_retriever = VectorIndexRetriever(
            index=vector_index,
            similarity_top_k=top_k,
            filters=metadata_filters
        )
        
        # Retrieve matching documents using the query string
        results = temp_retriever.retrieve(query)
        print(f"[DEBUG] Retrieved {len(results)} results from vector store")
        
        # Check if we got the expected number of results
        if len(results) < top_k:
            print(f"[WARNING] Retrieved fewer results ({len(results)}) than requested ({top_k})")
            
        # Extract content from each document
        contents = [doc.get_content() for doc in results]
        print(f"[DEBUG] Returning {len(contents)} document chunks")
        
        return contents
    except Exception as e:
        print(f"[ERROR] Vector search failed: {str(e)}")
        raise ValueError(f"Failed to search vectors in Pinecone: {e}")

def list_documents_in_pinecone():
    """
        Fetches all document IDs stored in Pinecone.
    """
    index_stats = index.describe_index_stats()
    return list(index_stats.get("namespaces", {}).keys()) if "namespaces" in index_stats else []