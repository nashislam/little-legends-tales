
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateStoryImage } from "@/lib/storyUtils";

interface Page {
  content: string;
  image?: string;
}

interface StoryBookProps {
  childName: string;
  pages: Page[];
  artStyle: string;
}

const StoryBook = ({ childName, pages, artStyle }: StoryBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);
  const totalPages = pages.length;

  useEffect(() => {
    const initialLoading = Array(pages.length).fill(true);
    setLoading(initialLoading);
    
    // Copy the pages initially
    setLoadedPages([...pages]);
    
    // Generate images for all pages asynchronously
    const generateAllImages = async () => {
      const updatedPages = [...pages];
      const newLoadingStates = [...initialLoading];
      
      // Process pages one by one to avoid overwhelming the API
      for (let i = 0; i < updatedPages.length; i++) {
        try {
          // Only generate if there's no image already
          if (!updatedPages[i].image) {
            const imageUrl = await generateStoryImage(updatedPages[i].content, i, artStyle);
            updatedPages[i] = { ...updatedPages[i], image: imageUrl };
          }
        } catch (error) {
          console.error(`Error generating image for page ${i}:`, error);
        }
        
        // Mark this page as loaded regardless of success/failure
        newLoadingStates[i] = false;
        setLoading([...newLoadingStates]);
        setLoadedPages([...updatedPages]);
      }
    };
    
    generateAllImages();
  }, [pages, artStyle]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Book title */}
      <h1 className="text-2xl md:text-3xl font-display mb-4 text-legend-blue">
        {childName}'s Magical Adventure
      </h1>
      <p className="text-gray-500 italic mb-6">
        Art style: {artStyle}
      </p>
      
      {/* Book container */}
      <div className="relative w-full max-w-3xl aspect-[3/2] bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
        {/* Page counter */}
        <div className="absolute top-2 right-2 bg-white/80 text-gray-500 px-2 py-1 rounded-md text-xs">
          Page {currentPage + 1} of {totalPages}
        </div>
        
        {/* Book content */}
        <div className="flex h-full">
          {/* Page content */}
          <div className="flex-1 p-8 overflow-auto flex flex-col justify-between">
            <div className="prose prose-lg">
              {loadedPages[currentPage]?.content || pages[currentPage]?.content}
            </div>
          </div>
          
          {/* Page illustration */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
            {loading[currentPage] ? (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="h-12 w-12 animate-spin mb-2" />
                <p>Generating illustration...</p>
              </div>
            ) : loadedPages[currentPage]?.image ? (
              <img 
                src={loadedPages[currentPage].image} 
                alt={`Illustration for page ${currentPage + 1}`} 
                className="max-h-full max-w-full object-contain rounded-lg shadow"
                onError={(e) => {
                  console.error("Image failed to load");
                  const target = e.target as HTMLImageElement;
                  target.src = `${import.meta.env.BASE_URL}placeholder.svg`;
                  target.classList.add("border", "border-red-200");
                }}
              />
            ) : (
              <div className="text-gray-400 italic text-center p-4">
                [Illustration would appear here]
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
          <Button 
            onClick={prevPage} 
            disabled={currentPage === 0}
            variant="ghost" 
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </Button>
          
          <Button 
            onClick={nextPage} 
            disabled={currentPage === totalPages - 1}
            variant="ghost"
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
      
      {/* Mobile view with stack layout */}
      <div className="md:hidden mt-4 space-y-8">
        {loadedPages.map((page, index) => (
          <div 
            key={index} 
            className={cn(
              "card p-6 bg-white rounded-lg shadow transition-all",
              currentPage === index ? "scale-100 opacity-100" : "scale-95 opacity-50"
            )}
          >
            <h3 className="font-semibold mb-2">Page {index + 1}</h3>
            <div className="prose mb-4">
              {page.content}
            </div>
            {loading[index] ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Generating illustration...</p>
              </div>
            ) : page.image && (
              <img 
                src={page.image} 
                alt={`Illustration for page ${index + 1}`} 
                className="w-full h-auto rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `${import.meta.env.BASE_URL}placeholder.svg`;
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryBook;
