
import React, { useEffect } from 'react';
import { usePDF } from '@/context/PDFContext';
import PDFUploader from '@/components/PDFUploader';
import ChatInterface from '@/components/ChatInterface';

const Index: React.FC = () => {
  const { isPdfLoaded, pdfFile } = usePDF();

  useEffect(() => {
    document.title = isPdfLoaded ? 'Chat with PDF' : 'Cognibot';
  }, [isPdfLoaded]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {!isPdfLoaded ? (
        <div className="container max-w-6xl mx-auto px-4 py-16 min-h-screen flex flex-col">
          <div className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 animate-fade-up bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
              Chat with your PDF
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl text-center max-w-2xl mb-10 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
              Upload a PDF document and ask questions to get instant, relevant answers from its content.
            </p>
            
            <PDFUploader />
            
            {/* <div className="mt-12 text-sm text-slate-500 dark:text-slate-400 text-center animate-fade-up opacity-0" style={{ animationDelay: '0.3s' }}>
              <p>Your document is processed locally in your browser.<br />For the best experience, use modern browsers like Chrome or Safari.</p>
            </div> */}
          </div>
        </div>
      ) : (
        <ChatInterface />
      )}
    </div>
  );
};

export default Index;
