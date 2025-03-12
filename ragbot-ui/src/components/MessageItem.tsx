
import React from 'react';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface MessageItemProps {
  message: Message;
  isLatest: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isLatest }) => {
  const isUser = message.role === 'user';
  
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
