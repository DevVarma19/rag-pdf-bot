import React, { useState, useRef, useEffect } from 'react';
import { usePDF } from '@/context/PDFContext';
import { Send, RefreshCw, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { queryPDF } from '@/utils/pdfUtils';
import { toast } from 'sonner';
import LoadingDots from './LoadingDots';
import MessageItem, { Message } from './MessageItem';
import TypingIndicator from './TypingIndicator';
import TypingMessage from './TypingMessage';

const ChatInterface: React.FC = () => {
  const { pdfText, pdfName, resetPdfContext, isProcessing: isPdfProcessing, setIsProcessing: setPdfProcessing } = usePDF();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Derived state to determine if the interface should be disabled
  const isInterfaceDisabled = isPdfProcessing || isMessageSending;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isInterfaceDisabled) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsMessageSending(true);
    
    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Simulate delay for a more natural conversation flow
      const response = await new Promise<{response: string, retrieved_chunks: string[]}>(resolve => {
        setTimeout(async () => {
          const result = await queryPDF(userMessage.content, pdfName);
          resolve(result);
        }, 1200);
      });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
        referenceChunks: response.retrieved_chunks
      };
      
      // Set the typing message
      setTypingMessage(assistantMessage);
      
    } catch (error) {
      console.error('Error querying PDF:', error);
      toast.error('Failed to process your question', {
        description: 'Please try again later'
      });
      setIsTyping(false);
    } finally {
      setIsMessageSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    if (messages.length > 0) {
      const confirmed = window.confirm('Are you sure you want to start a new chat? Your current conversation will be lost.');
      if (!confirmed) return;
    }
    resetPdfContext();
    setMessages([]);
    setTypingMessage(null);
    setIsTyping(false);
  };

  const handleTypingComplete = () => {
    if (typingMessage) {
      setMessages(prev => [...prev, typingMessage]);
      setTypingMessage(null);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950">
      {/* PDF info banner */}
      <div className="bg-slate-100 dark:bg-slate-900 py-2 px-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
          <FileText className="w-4 h-4 mr-2" />
          <span className="font-medium truncate max-w-[180px] sm:max-w-xs">{pdfName}</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleReset}
          className="h-8 w-8 rounded-full"
          disabled={isInterfaceDisabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator />
      
      {/* Message history */}
      <div className="flex-grow overflow-y-auto">
        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Ask questions about your PDF</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              {isPdfProcessing ? 
                "Your PDF is still being processed. Please wait..." : 
                "Your PDF has been processed. Ask any questions related to the content of your document."
              }
            </p>
            {isPdfProcessing && <LoadingDots className="mt-4" />}
          </div>
        ) : (
          <div className="pb-20">
            {messages.map((message, index) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                isLatest={index === messages.length - 1} 
              />
            ))}
            
            {isTyping && !typingMessage && <TypingIndicator />}
            
            {typingMessage && (
              <TypingMessage 
                message={typingMessage} 
                onComplete={handleTypingComplete} 
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4 sm:px-6 absolute bottom-0 left-0 right-0">
        <div className={`glass-panel rounded-xl overflow-hidden flex items-end max-w-3xl mx-auto ${isPdfProcessing ? 'opacity-70' : ''}`}>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isPdfProcessing ? "PDF is being processed..." : "Ask a question about your PDF..."}
            className="w-full resize-none p-3 focus:outline-none bg-transparent min-h-[56px] max-h-[200px]"
            rows={1}
            disabled={isInterfaceDisabled}
          />
          <div className="p-2 flex-shrink-0">
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={!inputValue.trim() || isInterfaceDisabled}
              className="rounded-full h-10 w-10 transition-all duration-200 bg-primary"
            >
              {isMessageSending ? (
                <LoadingDots color="bg-white" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-xs text-center text-slate-400 mt-2">
          {isPdfProcessing 
            ? "Please wait while your PDF is being processed..." 
            : "AI responses are generated based on the content of your uploaded PDF."
          }
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
