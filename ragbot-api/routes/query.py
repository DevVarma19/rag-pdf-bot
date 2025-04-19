from fastapi import APIRouter, HTTPException
from services.llm_service import get_llm
from services.embedding_service import get_embedding_model
from services.vector_store import search_vectors_in_pinecone
from models.document import QueryRequest, QueryResponse

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query_chatbot(query_data: QueryRequest):
    """
        Handles user query, retrieves relevant text chunks, and generates response using GPT-4.
    """
    try:
        print(f"[INFO] Processing query: '{query_data.query}' with top_k={query_data.top_k}")
        if query_data.doc_id:
            print(f"[INFO] Filtering by document ID: {query_data.doc_id}")
        if query_data.chunk_id is not None:
            print(f"[INFO] Filtering by chunk ID: {query_data.chunk_id}")
        
        # Select the embedding model
        embed_model = get_embedding_model()
        print(f"[INFO] Using embedding model: {embed_model}")

        # Retrieve most relevant chunks from db using LlamaIndex
        retrieved_chunks = search_vectors_in_pinecone(
            query_data.query, 
            query_data.top_k, 
            embed_model,
            doc_id=query_data.doc_id,
            chunk_id=query_data.chunk_id
        )
        print(f"[INFO] Retrieved {len(retrieved_chunks)} chunks for query")

        if not retrieved_chunks:
            print("[WARNING] No relevant chunks found for query")
            return QueryResponse(query=query_data.query, response="No relevant information found.", retrieved_chunks=[])

        llm = get_llm()
        print(f"[INFO] Using LLM: {llm}")

        # Prepare prompt for llm
        context = "\n\n".join(retrieved_chunks)
        prompt = f"""Using the following document content, provide a concise and accurate answer to the question. If the document contains relevant information, summarize it clearly. If the document does not contain relevant information, state that explicitly. Do not speculate beyond the provided content.
                    Extracted Content:
                    {context}
                    Question:
                    {query_data.query}"""

        #Generate response using llm
        print("[INFO] Generating LLM response")
        response = llm.complete(prompt)
        print(f"[INFO] Generated response: {response.text[:100]}...")
        
        return QueryResponse(query=query_data.query, response=response.text, retrieved_chunks=retrieved_chunks)
    except Exception as e:
        print(f"[ERROR] Query processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")
