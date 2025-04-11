
import React, { useState } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

interface PageIllustrationProps {
  loading: boolean;
  imageError?: boolean;
  image?: string;
  pageNumber: number;
  onRetry: (pageIndex: number) => Promise<void>;
  isTitlePage?: boolean;
  childName?: string;
}

const PageIllustration = ({ 
  loading, 
  imageError, 
  image, 
  pageNumber,
  onRetry,
  isTitlePage,
  childName
}: PageIllustrationProps) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  
  const handleImageError = () => {
    setImageLoadError(true);
  };
  
  const handleRetry = async () => {
    setImageLoadError(false);
    await onRetry(pageNumber);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 h-full w-full">
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-[#F7F0EA] flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-legend-blue opacity-70" />
          </div>
          <div className="absolute -bottom-2 w-full text-center">
            <p className="font-story text-sm text-gray-500">Creating picture...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (imageError || imageLoadError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Alert variant="destructive" className="mb-4 mx-4 bg-white/80 border border-red-100">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription className="font-story">
            {imageLoadError ? "Image couldn't load" : "Oops! Our drawing didn't work"}
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={handleRetry} 
          className="mt-4 font-story bg-legend-pink hover:bg-pink-500 text-white flex items-center gap-2"
          size="sm"
        >
          <RefreshCw size={16} />
          Try drawing again
        </Button>
      </div>
    );
  }
  
  if (image) {
    return (
      <div className="illustration-container w-full h-full flex items-center justify-center p-6">
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={image} 
            alt={`Illustration for page ${pageNumber + 1}`} 
            className={cn(
              "max-h-[85%] max-w-[85%] object-contain rounded-3xl",
              "shadow-[0_10px_25px_-15px_rgba(0,0,0,0.2)] transition-all border-8 border-white"
            )}
            onError={handleImageError}
          />
          
          {/* Overlay title on the image for title pages */}
          {isTitlePage && childName && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h1 className="text-3xl md:text-4xl font-display text-[#5D5FEF] mb-4 leading-tight">
                  {childName}'s<br/>Magical<br/>Adventure
                </h1>
                <div className="w-20 h-1 bg-legend-yellow rounded-full my-4 mx-auto"></div>
                <p className="text-xl font-story text-gray-600 mt-4">A personalized tale of wonder</p>
              </div>
            </div>
          )}
          
          <div className="absolute -bottom-2 right-0 p-2 bg-white/70 backdrop-blur-sm rounded-full px-3 text-xs text-gray-500 font-story">
            {pageNumber + 1}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="text-gray-400 italic text-center font-story p-4">
      [Illustration would appear here]
    </div>
  );
};

export default PageIllustration;
