import React from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import LoadingDots from './LoadingDots';

interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div className={cn("py-6 flex animate-fade-in bg-slate-50/80 dark:bg-slate-900/30", className)}>
      <div className="w-full max-w-3xl mx-auto flex gap-4 px-4 sm:px-6">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
            <Bot size={16} />
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="prose prose-slate dark:prose-invert max-w-none break-words">
            <div className="flex items-center">
              <span className="text-slate-500 dark:text-slate-400 mr-2">Assistant is typing</span>
              <LoadingDots />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator; 