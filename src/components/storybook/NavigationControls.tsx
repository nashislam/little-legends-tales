
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NavigationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const NavigationControls = ({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage 
}: NavigationControlsProps) => {
  return (
    <div className="flex justify-between items-center w-full py-4">
      {/* Left arrow with page number */}
      <Button 
        onClick={onPrevPage} 
        disabled={currentPage === 0}
        variant="ghost" 
        className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-white/70 shadow-sm hover:bg-white transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={24} className="text-gray-700" />
      </Button>
      
      {/* Page indicator using dots */}
      <div className="flex items-center space-x-1.5">
        {Array.from({length: totalPages}).map((_, i) => (
          <div 
            key={i} 
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i === currentPage 
                ? 'bg-legend-blue scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={i === currentPage ? `Current page ${i + 1}` : `Page ${i + 1}`}
          />
        ))}
      </div>
      
      {/* Right arrow */}
      <Button 
        onClick={onNextPage} 
        disabled={currentPage === totalPages - 1}
        variant="ghost"
        className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-white/70 shadow-sm hover:bg-white transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={24} className="text-gray-700" />
      </Button>
    </div>
  );
};

export default NavigationControls;
