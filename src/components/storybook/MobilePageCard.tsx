
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2, AlertTriangle } from 'lucide-react';
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
      <p key={idx} className="mb-4">{paragraph}</p>
    ));
  };
  
  return (
    <div 
      className={cn(
        "card p-6 bg-[#FFF9F5] rounded-lg shadow transition-all border border-[#E6D7CC]",
        currentPage === index ? "scale-100 opacity-100" : "scale-95 opacity-50"
      )}
    >
      {index === 0 ? (
        <div className="text-center mb-4">
          <h3 className="text-2xl font-display text-legend-blue mb-2">
            {childName}'s Magical Adventure
          </h3>
          <p className="text-sm font-story text-gray-600">A personalized tale of wonder</p>
        </div>
      ) : (
        <>
          <h3 className="font-semibold mb-2">Page {index + 1}</h3>
          <div className="prose font-story mb-4">
            {formatPageContent(page.content)}
          </div>
        </>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Generating illustration...</p>
        </div>
      ) : page.imageError ? (
        <div className="flex flex-col items-center justify-center py-4">
          <Alert variant="destructive" className="mb-3 w-full">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Image generation failed
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => onRetryImage(index)} 
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      ) : page.image && (
        <img 
          src={page.image} 
          alt={`Illustration for page ${index + 1}`} 
          className="w-full h-auto rounded"
        />
      )}
    </div>
  );
};

export default MobilePageCard;
