
import React, { useState, useRef, DragEvent } from 'react';
import { usePDF } from '@/context/PDFContext';
import { uploadPDF } from '@/utils/pdfUtils';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import LoadingDots from './LoadingDots';

const PDFUploader: React.FC = () => {
  const { setPdfFile, setPdfText, setIsProcessing, setPdfName, isProcessing } = usePDF();
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setErrorMsg('Please select a valid PDF file');
      toast.error('Invalid file type', {
        description: 'Only PDF files are supported',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB max
      setErrorMsg('File size exceeds the 10MB limit');
      toast.error('File too large', {
        description: 'Maximum file size is 10MB',
      });
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);
    setPdfFile(file);

    try {
      const result = await uploadPDF(file);
      
      if (result.success) {
        setPdfName(result.fileName);
        toast.success('PDF processed successfully', {
          description: `Extracted ${result.characterLength} characters from ${result.pageCount} pages`,
        });
      } else {
        setErrorMsg(result.message || 'Failed to process PDF');
        setPdfFile(null);
        toast.error('Failed to process PDF', {
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      setErrorMsg('An unexpected error occurred while processing the PDF');
      setPdfFile(null);
      toast.error('Processing error', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
      <div
        className={`drag-area p-8 flex flex-col items-center text-center ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf"
          onChange={handleFileInput}
        />
        
        {isProcessing ? (
          <div className="py-8 flex flex-col items-center">
            <div className="rounded-full bg-slate-100 p-3 mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <div className="mb-2 text-slate-800 font-medium">Processing PDF</div>
            <LoadingDots className="mt-2" />
          </div>
        ) : (
          <>
            <div className="rounded-full bg-slate-100 p-3 mb-4">
              <Upload className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium mb-1">Upload PDF</h3>
            <p className="text-sm text-slate-500 mb-4">
              Drag & drop or click to browse
            </p>
            <Button 
              onClick={openFileDialog}
              variant="outline" 
              className="rounded-full"
            >
              Select PDF
            </Button>
            <p className="text-xs text-slate-400 mt-4">
              Maximum file size: 10MB
            </p>
          </>
        )}
        
        {errorMsg && (
          <div className="mt-4 text-destructive flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploader;
