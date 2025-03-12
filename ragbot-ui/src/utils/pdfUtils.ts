
import * as pdfjs from 'pdfjs-dist';

// Set the worker source (needs to be updated based on PDFJS version)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface PDFProcessingResult {
  success: boolean;
  text: string;
  error?: string;
  pageCount?: number;
}

// export const extractTextFromPDF = async (file: File): Promise<PDFProcessingResult> => {
//   try {
//     // Convert the file to an ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer();
    
//     // Load the PDF document
//     const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
//     const pageCount = pdf.numPages;
    
//     // Extract text from each page
//     let fullText = '';
//     for (let i = 1; i <= pageCount; i++) {
//       const page = await pdf.getPage(i);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items
//         .map((item) => 'str' in item ? item.str : '')
//         .join(' ');
//       fullText += pageText + '\n\n';
//     }
    
//     return {
//       success: true,
//       text: fullText.trim(),
//       pageCount
//     };
//   } catch (error) {
//     console.error('Error extracting text from PDF:', error);
//     return {
//       success: false,
//       text: '',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//   }
// };

export const uploadPDF = async (file: File): Promise<{ success: boolean; message?: string; fileName?: string; pageCount?: number; characterLength?: number }> => {
  try {
    // Prepare FormData
    const formData = new FormData();
    formData.append("file", file); // Attach the file with key "file"

    // Send request to FastAPI backend
    const response = await fetch("http://localhost:8000/api/upload", {
      method: "POST",
      body: formData,
    });

    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    
    // Extract text from each page
    let fullText = '';
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => 'str' in item ? item.str : '')
        .join(' ');
      fullText += pageText + '\n\n';
    }

    // Parse JSON response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to upload PDF");
    }

    return { success: true, message: data.message, fileName: file.name, pageCount: pageCount, characterLength: fullText.length};
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
};

export const queryPDF = async (query: string): Promise<string> => {
  try {
    // Send query request to FastAPI backend
    const response = await fetch("http://localhost:8000/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, top_k: 5 }), // Adjust `top_k` as needed
    });

    // Parse the response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch query response");
    }

    return data.response; // Extract the generated response
  } catch (error) {
    console.error("Error querying PDF:", error);
    return "An error occurred while processing your request.";
  }
};


// export const queryPDF = async (query: string, pdfText: string): Promise<string> => {
//   // In a real application, this would connect to an AI service or backend
//   // For now, we'll simulate a response based on the query and PDF text
  
//   // Simple keyword matching (this is just a placeholder)
//   const words = query.toLowerCase().split(' ');
//   const pdfLower = pdfText.toLowerCase();
  
//   // Find the most relevant paragraph containing the query words
//   const paragraphs = pdfText.split('\n\n');
//   let bestParagraph = '';
//   let bestScore = 0;
  
//   for (const para of paragraphs) {
//     if (para.trim().length < 20) continue; // Skip very short paragraphs
    
//     let score = 0;
//     const paraLower = para.toLowerCase();
//     for (const word of words) {
//       if (word.length <= 3) continue; // Skip short words
//       if (paraLower.includes(word)) score += 1;
//     }
    
//     if (score > bestScore) {
//       bestScore = score;
//       bestParagraph = para;
//     }
//   }
  
//   if (bestScore > 0) {
//     return `Based on the PDF content: "${bestParagraph.trim()}"`;
//   } else {
//     return "I couldn't find information related to your query in the uploaded PDF. Please try asking something else related to the document's content.";
//   }
// };

