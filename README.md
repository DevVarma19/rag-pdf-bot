---

# RAG-PDF-CHATBOT

## 📌 Overview  
The **RAG-PDF-CHATBOT** enables users to upload PDF documents and ask questions, receiving intelligent responses based on the document content. It utilizes **Retrieval-Augmented Generation (RAG)** with **LLMs, embeddings, and a vector database** for efficient document-based querying.

### 🔹 Key Technologies:
- **LLM & Embeddings**: OpenAI APIs (GPT-4 & `text-embedding-ada-002`)
- **Vector Storage**: Pinecone
- **Backend**: FastAPI (Python)
- **Frontend**: React
- **PDF Processing**: PyPDF2 (No OCR support)

---

## 🏗️ System Architecture

### **High-Level Architecture Flow**

1. **User Interaction**

   - Users upload PDFs and submit queries via the **React frontend**.
   - The system processes queries using OpenAI's **LLM and stored vector embeddings**.

2. **Backend (FastAPI)**

   - Manages API endpoints for PDF upload, query retrieval, and LLM interaction.
   - Routes requests to different services (**document processing, vector storage, and query handling**).

3. **PDF Processing Module**

   - Extracts text from PDFs using **PyPDF2**.
   - Chunks text into **meaningful sections** for efficient retrieval.
   - Cleans and preprocesses extracted text.

4. **Embedding Model (OpenAI)**

   - Converts text chunks into vector embeddings using `text-embedding-ada-002`.
   - Stores embeddings in **Pinecone** for quick retrieval.

5. **Vector Database (Pinecone)**

   - Stores document chunks and corresponding **vector embeddings**.
   - Enables **fast similarity search** for retrieving relevant text sections.

6. **Retrieval & Context Builder**

   - Converts user queries into **vector embeddings**.
   - Searches Pinecone for **relevant document chunks**.
   - Constructs context from retrieved text for **LLM response generation**.

7. **LLM**

   - Processes user queries along with the **retrieved document context**.
   - Generates a well-structured response based on the available context.

8. **Response to User**
   - The chatbot sends the **final response** back to the frontend.
   - The response is displayed in the chat interface.

---

## 🔄 Data Flow Process

1️⃣ **User Uploads a PDF** → The file is sent to the backend for processing.  
2️⃣ **Text Extraction & Chunking** → Extracted text is cleaned and divided into smaller **chunks**.  
3️⃣ **Embedding Generation** → Each chunk is converted into a **vector embedding** using OpenAI.  
4️⃣ **Storing in Pinecone** → Vector embeddings are stored for **future retrieval**.  
5️⃣ **User Submits Query** → The system retrieves **relevant document chunks** from Pinecone.  
6️⃣ **Context Building** → The best-matching chunks are formatted as input to GPT-4.  
7️⃣ **Response Generation** → GPT generates an answer based on the **retrieved context**.  
8️⃣ **Response Display** → The response is sent back to the frontend and shown to the user.

---

## 🛠️ Evaluation of Responses

After querying the **RAG-PDF-API**, response evaluation is crucial. **LlamaIndex** provides several evaluation methods to ensure response quality.

### **Relevance Evaluation (No Ground Truth Needed)**

- Use **LlamaIndex's `RelevancyEvaluator`** to assess whether the generated responses are **relevant** based on the retrieved document context.
- No labeled datasets are required for this type of evaluation.

### 🔗 **Useful Links**

- [LlamaIndex Relevance Evaluation Guide](https://docs.llamaindex.ai/en/module_guides/evaluating/usage_pattern.html)
- [LlamaIndex Relevancy Evaluator](https://docs.llamaindex.ai/en/stable/examples/evaluation/relevancy_eval.html)
- [Evaluating Search with Human Judgment](https://dtunkelang.medium.com/evaluating-search-using-human-judgement-fbb2eeba37d9)

---

## 🚀 Getting Started

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-repo/rag-pdf-bot.git
cd rag-pdf-bot
cd ragbot-api
```

### **2️⃣ Install Dependencies**

```sh
pip install -r requirements.txt
```

### **3️⃣ Run the Backend**

```sh
uvicorn main:app --reload
```

### **4️⃣ Start the Frontend**

```sh
cd ../
cd ragbot-ui
npm install
npm start
```

---

## 🎯 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📜 License

MIT License. See `LICENSE` for details.
