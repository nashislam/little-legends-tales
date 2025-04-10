
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateStoryImage } from "@/lib/storyUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Page {
  content: string;
  image?: string;
  imageError?: boolean;
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
            updatedPages[i] = { 
              ...updatedPages[i], 
              image: imageUrl,
              imageError: imageUrl.includes('placeholder')  // Mark as error if returning placeholder
            };
          }
        } catch (error) {
          console.error(`Error generating image for page ${i}:`, error);
          updatedPages[i] = { 
            ...updatedPages[i], 
            imageError: true,
            image: `${import.meta.env.BASE_URL}placeholder.svg` 
          };
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

  const retryImageGeneration = async (pageIndex: number) => {
    // Mark the page as loading
    const newLoadingStates = [...loading];
    newLoadingStates[pageIndex] = true;
    setLoading(newLoadingStates);
    
    try {
      const imageUrl = await generateStoryImage(loadedPages[pageIndex].content, pageIndex, artStyle);
      const updatedPages = [...loadedPages];
      updatedPages[pageIndex] = { 
        ...updatedPages[pageIndex], 
        image: imageUrl,
        imageError: imageUrl.includes('placeholder') 
      };
      setLoadedPages(updatedPages);
    } catch (error) {
      console.error(`Error retrying image generation for page ${pageIndex}:`, error);
      const updatedPages = [...loadedPages];
      updatedPages[pageIndex] = { 
        ...updatedPages[pageIndex], 
        imageError: true,
        image: `${import.meta.env.BASE_URL}placeholder.svg`
      };
      setLoadedPages(updatedPages);
    }
    
    // Mark as no longer loading
    newLoadingStates[pageIndex] = false;
    setLoading(newLoadingStates);
  };
  
  // Format page content with line breaks and proper spacing
  const formatPageContent = (content: string) => {
    if (!content) return null;
    
    // Split content by paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((paragraph, idx) => (
      <p key={idx} className="mb-4">{paragraph}</p>
    ));
  };
  
  // Determine if we're on the title page (first page)
  const isTitlePage = currentPage === 0;

  return (
    <div className="flex flex-col items-center">
      {/* Book title */}
      <h1 className="text-2xl md:text-3xl font-display mb-4 text-legend-blue">
        {childName}'s Magical Adventure
      </h1>
      <p className="text-gray-500 italic mb-6">
        Art style: {artStyle}
      </p>
      
      {/* Book container with rounded corners and shading to look book-like */}
      <div className="relative w-full max-w-3xl aspect-[3/2] bg-[#FFF9F5] rounded-lg shadow-lg mb-8 overflow-hidden border-2 border-[#E6D7CC]">
        {/* Page counter */}
        <div className="absolute top-2 right-2 bg-white/80 text-gray-500 px-2 py-1 rounded-md text-xs">
          Page {currentPage + 1} of {totalPages}
        </div>
        
        {/* Book content */}
        <div className="flex h-full">
          {/* Page content */}
          <div className="flex-1 p-8 overflow-auto flex flex-col justify-between">
            {isTitlePage ? (
              <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-display text-legend-blue mb-6">
                  {childName}'s Magical Adventure
                </h1>
                <p className="text-xl font-story text-gray-600 mb-4">A personalized tale of wonder</p>
                <p className="font-story text-lg text-gray-500 mt-8">Written just for {childName}</p>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none font-story leading-relaxed text-lg">
                {formatPageContent(loadedPages[currentPage]?.content || pages[currentPage]?.content)}
              </div>
            )}
          </div>
          
          {/* Page illustration */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 relative">
            {loading[currentPage] ? (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="h-12 w-12 animate-spin mb-2" />
                <p>Generating illustration...</p>
              </div>
            ) : loadedPages[currentPage]?.imageError ? (
              <div className="flex flex-col items-center justify-center w-full">
                <Alert variant="destructive" className="mb-4 mx-4">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Image generation failed
                  </AlertDescription>
                </Alert>
                
                <img 
                  src={loadedPages[currentPage].image} 
                  alt="Placeholder illustration" 
                  className="max-h-[60%] max-w-[60%] object-contain opacity-50"
                />
                
                <Button 
                  onClick={() => retryImageGeneration(currentPage)} 
                  className="mt-4"
                  variant="outline"
                >
                  Retry Image Generation
                </Button>
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
                  const updatedPages = [...loadedPages];
                  updatedPages[currentPage] = { 
                    ...updatedPages[currentPage], 
                    imageError: true,
                    image: `${import.meta.env.BASE_URL}placeholder.svg`
                  };
                  setLoadedPages(updatedPages);
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
            {loading[index] ? (
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
                  onClick={() => retryImageGeneration(index)} 
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `${import.meta.env.BASE_URL}placeholder.svg`;
                  
                  const updatedPages = [...loadedPages];
                  updatedPages[index] = { 
                    ...updatedPages[index], 
                    imageError: true,
                    image: `${import.meta.env.BASE_URL}placeholder.svg`
                  };
                  setLoadedPages(updatedPages);
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
