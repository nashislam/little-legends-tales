
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MobilePageCardProps {
  page: {
    content: string;
    image?: string;
    imageError?: boolean;
  };
  index: number;
  currentPage: number;
  childName: string;
  loading: boolean;
  onRetryImage: (pageIndex: number) => Promise<void>;
}

const MobilePageCard = ({ 
  page, 
  index, 
  currentPage, 
  childName, 
  loading, 
  onRetryImage 
}: MobilePageCardProps) => {
  // Format page content with line breaks and proper spacing
  const formatPageContent = (content: string) => {
    if (!content) return null;
    
    // Split content by paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((paragraph, idx) => (
      <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
    ));
  };
  
  return (
    <div 
      className={cn(
        "p-6 bg-[#FFF9F5] rounded-3xl transition-all duration-300 border-2 border-[#E6D7CC]",
        "shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] board-book-page-mobile",
        currentPage === index 
          ? "scale-100 opacity-100 rotate-0" 
          : index < currentPage 
            ? "scale-90 opacity-40 -rotate-1 -translate-y-4" 
            : "scale-90 opacity-40 rotate-1 translate-y-4"
      )}
    >
      {index === 0 ? (
        <div className="text-center mb-6 py-8">
          <h3 className="text-3xl font-display text-[#5D5FEF] mb-3 leading-tight">
            {childName}'s Magical Adventure
          </h3>
          <div className="w-12 h-1 bg-legend-yellow rounded-full my-4 mx-auto"></div>
          <p className="text-lg font-story text-gray-600 mt-4">A personalized tale of wonder</p>
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Loader2 className="h-10 w-10 animate-spin mb-2 text-legend-blue" />
                <p className="font-story text-sm">Creating picture...</p>
              </div>
            ) : page.imageError ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Alert variant="destructive" className="mb-3 w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription className="font-story text-sm">
                    Image creation failed
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => onRetryImage(index)} 
                  variant="outline" 
                  size="sm"
                  className="mt-2 font-story flex items-center gap-1 border-legend-pink text-legend-pink"
                >
                  <RefreshCw size={14} />
                  Retry
                </Button>
              </div>
            ) : page.image && (
              <img 
                src={page.image} 
                alt={`Illustration for page ${index + 1}`} 
                className="w-full h-auto rounded-xl mb-6 shadow-md border-2 border-white"
              />
            )}
          </div>
          
          <div className="prose font-story text-lg leading-relaxed text-[#2D3748]">
            {formatPageContent(page.content)}
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="h-2 w-2 rounded-full bg-legend-yellow"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobilePageCard;
