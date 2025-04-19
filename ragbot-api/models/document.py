from pydantic import BaseModel
from typing import List, Optional

# Request Model for File Upload
class FileUploadResponse(BaseModel):
    file_name: str
    file_size: int
    message: str

# Request Model for Querying the Chatbot
class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    doc_id: Optional[str] = None
    chunk_id: Optional[int] = None

# Response Model for LLM Query Response
class QueryResponse(BaseModel):
    query: str
    response: str  # The final chatbot-generated answer
    retrieved_chunks: List[str]  # List of relevant text chunks used in response
