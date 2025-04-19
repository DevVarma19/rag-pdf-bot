from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import PyPDF2
from langchain.text_splitter import CharacterTextSplitter
import re

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

def clean_text(text):
    """
        Cleans text by removing extra whitespace and newlines
    """
    print(f"[INFO] Cleaning text")
    cleaned_text = text.strip().replace("\n", " ")
    ## Remove unwanted symbols
    cleaned_text = re.sub('[^a-zA-Z#]', ' ', cleaned_text, re.UNICODE) # keep only a-z, A-Z, and # symbols  
    print(f"[INFO] Cleaned text: {cleaned_text}")
    return cleaned_text 

def chunk_text(text, chunk_size = CHUNK_SIZE, overlap = OVERLAP):
    """
        Splits text into smaller chunks with overlap
    """
    print(f"[INFO] Chunking text with chunk_size: {chunk_size} and overlap: {overlap}")
    
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        length_function=len
    )
    text_chunks = text_splitter.split_text(text)
    print(f"[INFO] Split text into {len(text_chunks)} chunks")
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
        
        # Clean text
        text = clean_text(get_pdf_content(file_path))
            
        # Extract text from PDF
        text = get_pdf_content(file_path)

        text_chunks = chunk_text(text)
        
        if not text_chunks:
            raise HTTPException(status_code=400, detail="No text chunks extracted from PDF.")

        store_vectors_in_pinecone(text_chunks, file.filename)

        return {
            "file_name": file.filename,
            "num_chunks": len(text_chunks),
            "message": "File processed successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))