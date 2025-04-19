import React from 'react';
import { X, BookOpen, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  chunks: string[];
}

const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose, chunks }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-slide-in-right" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <h3 className="font-medium text-lg">Source References</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-5 overflow-y-auto max-h-[calc(80vh-8rem)]">
          {chunks.length > 0 ? (
            <div className="space-y-4">
              {chunks.map((chunk, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border-l-4 border-emerald-400 dark:border-emerald-500 shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <Quote className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">{chunk}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400">No references available</p>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800">
          These excerpts from the document were used to generate the AI response.
        </div>
      </div>
    </div>
  );
};

export default ReferenceModal; 