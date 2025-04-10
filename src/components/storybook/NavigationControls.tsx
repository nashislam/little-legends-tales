
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
    <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
      <Button 
        onClick={onPrevPage} 
        disabled={currentPage === 0}
        variant="ghost" 
        className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </Button>
      
      <Button 
        onClick={onNextPage} 
        disabled={currentPage === totalPages - 1}
        variant="ghost"
        className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};

export default NavigationControls;
