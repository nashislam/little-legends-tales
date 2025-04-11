
import React from 'react';
import { Book } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface BookCoverProps {
  image?: string;
  childName: string;
  loading: boolean;
  onOpenBook: () => void;
}

const BookCover = ({ image, childName, loading, onOpenBook }: BookCoverProps) => {
  return (
    <div 
      className={cn(
        "relative w-full h-full rounded-lg overflow-hidden",
        "flex flex-col items-center justify-center",
        "transition-all duration-500 transform",
        "bg-gradient-to-b from-[#F9F5F2] to-[#F5EFE9]",
        "book-cover shadow-[0_10px_50px_rgba(0,0,0,0.2)]"
      )}
      onClick={onOpenBook} // Make the entire cover clickable
    >
      {/* Book cover image */}
      {image ? (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={image} 
            alt={`${childName}'s story book cover`} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200"></div>
            <div className="mt-4 text-gray-400">Creating your cover...</div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <Book size={48} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}
      
      {/* Title overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-md">
          <h1 className="text-3xl md:text-4xl font-display text-[#5D5FEF] mb-4 leading-tight">
            {childName}'s<br/>Magical<br/>Adventure
          </h1>
          <div className="w-20 h-1 bg-legend-yellow rounded-full my-4 mx-auto"></div>
          <p className="text-xl font-story text-gray-600 mt-4">A personalized tale of wonder</p>
        </div>
      </div>
      
      {/* Open book button - made more prominent */}
      <Button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent the cover click event from firing
          onOpenBook();
        }}
        className={cn(
          "absolute bottom-12 animate-bounce",
          "bg-legend-blue hover:bg-blue-600 text-white",
          "flex items-center gap-2 rounded-full px-8 py-5 shadow-lg",
          "text-lg font-medium"
        )}
      >
        <Book size={22} />
        Open Book
      </Button>
      
      {/* Book spine decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-[20px] bg-gradient-to-r from-[#E6D7CC] to-[#F5F0EA] shadow-inner">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="w-[2px] h-2/3 bg-[#0000001a]"></div>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
