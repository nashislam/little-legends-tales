
import React, { useState, useEffect } from 'react';
import { generateImagesForAllPages, retryImageForPage } from './storybook/ImageGenerationService';
import BookContainer from './storybook/BookContainer';
import { useToast } from '@/hooks/use-toast';

interface Page {
  content: string;
  image?: string;
  imageError?: boolean;
}

interface StoryBookProps {
  childName: string;
  pages: Page[];
  artStyle: string;
  storyText?: string; // Full story text for consistency analysis
}

const StoryBook = ({ childName, pages, artStyle, storyText = "" }: StoryBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);
  const [imageGenerationAttempted, setImageGenerationAttempted] = useState(false);
  const { toast } = useToast();
  const totalPages = pages.length;

  useEffect(() => {
    const initialLoading = Array(pages.length).fill(true);
    setLoading(initialLoading);
    
    // Copy the pages initially
    setLoadedPages([...pages]);
    
    // Generate images for all pages
    const generateAllImages = async () => {
      try {
        // Set loading state
        setLoading(Array(pages.length).fill(true));
        
        // Generate consistent images across all pages
        const updatedPages = await generateImagesForAllPages(
          pages, 
          childName, 
          artStyle,
          storyText
        );
        
        // Update with completed pages
        setLoadedPages(updatedPages);
        setImageGenerationAttempted(true);
        
        // Check if we have any errors
        const hasErrors = updatedPages.some(page => page.imageError);
        if (hasErrors) {
          toast({
            title: "Some illustrations couldn't be generated",
            description: "You can click 'Try drawing again' on any image that didn't load correctly.",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error generating images:', error);
        toast({
          title: "Image Generation Issue",
          description: "We had trouble creating some illustrations. You can try again later.",
          variant: "destructive"
        });
      } finally {
        // Mark all pages as loaded regardless of success/failure
        setLoading(Array(pages.length).fill(false));
      }
    };
    
    generateAllImages();
  }, [pages, childName, artStyle, storyText, toast]);

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
      toast({
        title: "Retrying illustration",
        description: "Creating a new picture for this page...",
      });
      
      const imageUrl = await retryImageForPage(loadedPages[pageIndex], pageIndex, artStyle);
      const updatedPages = [...loadedPages];
      const isPlaceholder = imageUrl.includes('placeholder');
      
      updatedPages[pageIndex] = { 
        ...updatedPages[pageIndex], 
        image: imageUrl,
        imageError: isPlaceholder
      };
      setLoadedPages(updatedPages);
      
      if (!isPlaceholder) {
        toast({
          title: "Success!",
          description: "New illustration created successfully.",
        });
      } else {
        toast({
          title: "Still having trouble",
          description: "We couldn't create an illustration. Try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error retrying image generation for page ${pageIndex}:`, error);
      const updatedPages = [...loadedPages];
      updatedPages[pageIndex] = { 
        ...updatedPages[pageIndex], 
        imageError: true,
        image: `${import.meta.env.BASE_URL}placeholder.svg`
      };
      setLoadedPages(updatedPages);
      
      toast({
        title: "Image Generation Failed",
        description: "We couldn't create an illustration. Try again later.",
        variant: "destructive"
      });
    }
    
    // Mark as no longer loading
    newLoadingStates[pageIndex] = false;
    setLoading(newLoadingStates);
  };

  return (
    <BookContainer
      childName={childName}
      currentPage={currentPage}
      totalPages={totalPages}
      loadedPages={loadedPages}
      loading={loading}
      onNextPage={nextPage}
      onPrevPage={prevPage}
      onRetryImageGeneration={retryImageGeneration}
    />
  );
};

export default StoryBook;
