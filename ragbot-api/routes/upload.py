from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import PyPDF2
from langchain.text_splitter import CharacterTextSplitter

from services.vector_store import store_vectors_in_pinecone

from config import UPLOAD_DIR, CHUNK_SIZE, OVERLAP

router = APIRouter()

os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_pdf_content(pdf_path):
    """
        Extacts text from a PDF File
    """
    raw_text = ""

    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                extract_text = page.extract_text()
                if extract_text:
                    raw_text += extract_text + "\n"

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {e}")
    
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="No text found in the PDF")
    
    return raw_text.strip()

def chunk_text(text, chunk_size = CHUNK_SIZE, overlap = OVERLAP):
    """
        Splits text into smaller chunks with overlap
    """
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        length_function=len
    )
    text_chunks = text_splitter.split_text(text)
    return text_chunks

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
        API endpoint to upload a PDF, process its text and store in embeddings
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

            # Save file locally
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())
            
            # Extract text from PDF
        text = get_pdf_content(file_path)
        if not text:
            raise HTTPException(status_code=400, detail="No text extracted from PDF.")

        text_chunks = chunk_text(text)

        store_vectors_in_pinecone(text_chunks, file.filename)

        return {
            "file_name": file.filename,
            "num_chunks": len(text_chunks),
            "message": "File processed successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))