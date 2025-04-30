## 📌 Overview  
The **RAG-PDF-CHATBOT** enables users to upload PDF documents and ask questions, receiving intelligent responses based on document content. It uses **Retrieval-Augmented Generation (RAG)** with **LLMs, embeddings, and a vector database** to enable **context-aware and verifiable** Q&A.

### 🔹 Key Technologies:
- **LLM & Embeddings**: OpenAI APIs (`gpt-4`, `text-embedding-ada-002`)
- **Vector Storage**: Pinecone
- **Backend**: FastAPI (Python)
- **Frontend**: React
- **PDF Processing**: PyPDF2 (No OCR support)

---

## 🧠 Trustworthy AI: Why It Matters

This chatbot is designed not just for accurate answers, but **trustworthy ones**. We ensure **transparency, traceability, and user verifiability** through:

- **Citations for every answer** from retrieved document chunks.
- **Fact-checking against external sources** (e.g., Wikipedia, ArXiv).
- **Bias mitigation** using diverse embedding strategies.
- **User-centric explainability** to support informed decision-making.

---

## 🏗️ System Architecture

### **High-Level Architecture Flow**

1. **User Interaction**  
   Upload PDFs and submit questions via the **React UI**.  

2. **Backend (FastAPI)**  
   Routes requests for **PDF processing**, **embedding**, **retrieval**, and **LLM generation**.  

3. **PDF Processing**  
   - Extracts text using **PyPDF2**
   - Chunks content for semantic embedding
   - Cleans and normalizes document data

4. **Embedding Model**  
   Converts chunks into **vector embeddings** via OpenAI and stores them in Pinecone.

5. **Vector Database (Pinecone)**  
   Enables **semantic search** over embedded chunks for fast, relevant retrieval.

6. **Retrieval + Context Builder**  
   Matches queries to document vectors, builds **context window** for GPT-4.

7. **LLM Response Generation**  
   GPT-4 generates answers using document context, with **citation snippets included**.

8. **Frontend Display**  
   User sees AI answer **with traceable citations**, improving transparency.

---

## 🔄 Data Flow Process

1️⃣ **PDF Upload**  
User uploads a PDF document through the chat interface.

2️⃣ **Text Extraction & Chunking**  
The system extracts raw text from the PDF, cleans it, and segments it into coherent, meaningful chunks for semantic indexing.

3️⃣ **Embedding Generation**  
Each chunk is transformed into a dense vector embedding using `text-embedding-ada-002`, capturing its contextual meaning.

4️⃣ **Vector Storage**  
Embeddings are stored in the **Pinecone** vector database, enabling fast and accurate similarity search during queries.

5️⃣ **User Query Submission**  
User enters a natural-language question through the chat interface.

6️⃣ **Semantic Retrieval & Context Assembly**  
The system retrieves the most relevant document chunks based on the semantic similarity of the query and compiles them into a context window.

7️⃣ **LLM Response Generation**  
GPT-4 processes the user query along with the retrieved context to generate a coherent, context-aware, and citation-backed response.

8️⃣ **Answer Display with Citations**  
The chatbot displays the response along with **directly linked document snippets**, allowing users to verify and trust the answer.

---

## 🔍 Explainability & Trustworthiness Features

| Feature                     | Purpose                                                  |
|----------------------------|----------------------------------------------------------|
| 🔗 **Citations in Response**   | Every answer includes the source snippet for traceability |
| 🕵️ **Fact Checking**         | Optional cross-verification using external sources        |
| 🧮 **Bias Detection**         | Reduces embedding/model bias via diversified techniques   |
| 🧪 **Evaluation Benchmarks**  | System tested using vague, ambiguous, and edge-case queries |
| 🛡️ **Uncertainty Handling**   | Ambiguity is acknowledged to avoid overconfident replies  |

---

## 🧪 Evaluation Framework

Our evaluation is modeled after **LlamaIndex's Relevance Evaluator** and our custom benchmark:

| Metric                | Description                                                   |
|-----------------------|---------------------------------------------------------------|
| ✅ Justification Score | Measures how well the response is grounded in retrieved content |
| 🔗 Citation Accuracy  | Checks visibility and correctness of cited chunks              |
| 🔍 Verifiability      | Tests whether users can trace answers back to original PDF     |
| ⚠️ Edge Case Handling | Evaluates how system reacts to ambiguous/unrelated input       |

Each metric is scored on a scale from 0–5 to ensure measurable performance.

---

## 🚀 Getting Started

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/your-repo/rag-pdf-bot.git
cd rag-pdf-bot
cd ragbot-api
```

### **2️⃣ Install Dependencies**

```bash
pip install -r requirements.txt
```

### **3️⃣ Start the Backend**

```bash
uvicorn main:app --reload
```

### **4️⃣ Run the Frontend**

```bash
cd ../ragbot-ui
npm install
npm run dev
```

---

## 📷 Demo Preview

Example screenshots show:
- Home screen:
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/17f48bc1-619e-46b7-9c06-8f48ba05b28f" />
- Uploaded document:
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/a809f55f-e9ef-4db0-a3cd-5bd4bbd39c6c" />
- Question & AI-generated answer with citation:
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/559e278a-ef60-4a53-ba93-953c8e04b75f" />
- Ability to click/trace source:
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/82c9ec8c-16cc-4bb1-9706-8c1e47aeb9b0" />
- Asking question out of context:
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/5755ae36-d41b-4199-8b27-1c6cdaaf049a" />
