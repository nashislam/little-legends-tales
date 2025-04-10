
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
      <p key={idx} className="mb-6 leading-relaxed text-left">{paragraph}</p>
    ));
  };
  
  return (
    <div 
      className={cn(
        "p-8 bg-[#FFF9F5] rounded-3xl transition-all duration-300 border-2 border-[#E6D7CC]",
        "shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] board-book-page-mobile",
        currentPage === index 
          ? "scale-100 opacity-100 rotate-0" 
          : index < currentPage 
            ? "scale-90 opacity-40 -rotate-1 -translate-y-4" 
            : "scale-90 opacity-40 rotate-1 translate-y-4"
      )}
    >
      {index === 0 ? (
        <div className="text-center mb-8 py-12">
          <h3 className="text-3xl font-display text-[#5D5FEF] mb-6 leading-tight">
            {childName}'s Magical Adventure
          </h3>
          <div className="w-16 h-1 bg-legend-yellow rounded-full my-6 mx-auto"></div>
          <p className="text-xl font-story text-gray-600 mt-6">A personalized tale of wonder</p>
        </div>
      ) : (
        <>
          <div className="relative mb-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Loader2 className="h-12 w-12 animate-spin mb-3 text-legend-blue" />
                <p className="font-story text-sm">Creating picture...</p>
              </div>
            ) : page.imageError ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Alert variant="destructive" className="mb-4 w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription className="font-story text-sm">
                    Image creation failed
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => onRetryImage(index)} 
                  variant="outline" 
                  size="sm"
                  className="mt-3 font-story flex items-center gap-1 border-legend-pink text-legend-pink"
                >
                  <RefreshCw size={14} />
                  Retry
                </Button>
              </div>
            ) : page.image && (
              <img 
                src={page.image} 
                alt={`Illustration for page ${index + 1}`} 
                className="w-full h-auto rounded-3xl mb-8 shadow-md border-8 border-white"
              />
            )}
          </div>
          
          <div className="prose max-w-none font-story text-xl leading-loose text-[#2D3748]">
            {formatPageContent(page.content)}
          </div>
          
          <div className="flex justify-center mt-6">
            <div className="h-3 w-3 rounded-full bg-legend-yellow"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobilePageCard;
