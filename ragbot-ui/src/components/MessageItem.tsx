import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Bot, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReferenceModal from './ReferenceModal';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  referenceChunks?: string[];
}

interface MessageItemProps {
  message: Message;
  isLatest: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isLatest }) => {
  const isUser = message.role === 'user';
  const [showReferences, setShowReferences] = useState(false);
  
  return (
    <div 
      className={cn(
        "py-6 flex animate-fade-in",
        isUser ? "bg-transparent" : "bg-slate-50/80 dark:bg-slate-900/30"
      )}
    >
      <div className="w-full max-w-3xl mx-auto flex gap-4 px-4 sm:px-6">
        <div className="flex-shrink-0 mt-1">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            isUser ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
          )}>
            {isUser ? (
              <User size={16} />
            ) : (
              <Bot size={16} />
            )}
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="prose prose-slate dark:prose-invert max-w-none break-words">
            <p className="whitespace-pre-line">{message.content}</p>
            
            {!isUser && message.referenceChunks && message.referenceChunks.length > 0 && (
              <div className="mt-3 flex">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs flex items-center gap-1.5 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => setShowReferences(true)}
                >
                  <BookOpen size={14} />
                  <span>View Sources ({message.referenceChunks.length})</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!isUser && message.referenceChunks && (
        <ReferenceModal 
          isOpen={showReferences} 
          onClose={() => setShowReferences(false)} 
          chunks={message.referenceChunks} 
        />
      )}
    </div>
  );
};

export default MessageItem;
