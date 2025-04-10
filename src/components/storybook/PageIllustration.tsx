
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PageIllustrationProps {
  loading: boolean;
  imageError?: boolean;
  image?: string;
  pageNumber: number;
  onRetry: (pageIndex: number) => Promise<void>;
}

const PageIllustration = ({ 
  loading, 
  imageError, 
  image, 
  pageNumber,
  onRetry 
}: PageIllustrationProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="h-12 w-12 animate-spin mb-2" />
        <p>Generating illustration...</p>
      </div>
    );
  }
  
  if (imageError) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <Alert variant="destructive" className="mb-4 mx-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Image generation failed
          </AlertDescription>
        </Alert>
        
        <img 
          src={image} 
          alt="Placeholder illustration" 
          className="max-h-[60%] max-w-[60%] object-contain opacity-50"
        />
        
        <Button 
          onClick={() => onRetry(pageNumber)} 
          className="mt-4"
          variant="outline"
        >
          Retry Image Generation
        </Button>
      </div>
    );
  }
  
  if (image) {
    return (
      <img 
        src={image} 
        alt={`Illustration for page ${pageNumber + 1}`} 
        className="max-h-full max-w-full object-contain rounded-lg shadow"
      />
    );
  }
  
  return (
    <div className="text-gray-400 italic text-center p-4">
      [Illustration would appear here]
    </div>
  );
};

export default PageIllustration;
