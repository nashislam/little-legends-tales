
import React, { useState, useEffect } from 'react';
import { generateConsistentStoryImages } from '@/lib/story/imageService';
import { supabase } from '@/integrations/supabase/client';
import BookContainer from './storybook/BookContainer';
import { useToast } from '@/hooks/use-toast';

interface Page {
  content: string;
  image?: string;
  imagePrompt?: string;
  imageError?: boolean;
  pageNumber: number;
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
    
    setLoadedPages([...pages]);
    
    const generateAllImages = async () => {
      try {
        console.log("Generating images for pages with prompts:", pages);
        const updatedPages = await generateConsistentStoryImages(
          loadedPages, 
          childName, 
          artStyle
        );
        
        setLoadedPages(updatedPages);
        setImageGenerationAttempted(true);
        
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
        setLoading(Array(pages.length).fill(false));
      }
    };
    
    generateAllImages();
  }, [pages, childName, artStyle, toast]);

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
    const newLoadingStates = [...loading];
    newLoadingStates[pageIndex] = true;
    setLoading(newLoadingStates);
    
    try {
      toast({
        title: "Retrying illustration",
        description: "Creating a new picture for this page...",
      });
      
      const pageToRetry = loadedPages[pageIndex];
      const prompt = pageToRetry.imagePrompt || pageToRetry.content;
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt,
          artStyle,
        },
      });
      
      if (error || !data?.imageUrl) {
        throw new Error('Failed to generate image');
      }
      
      const updatedPages = [...loadedPages];
      updatedPages[pageIndex] = { 
        ...updatedPages[pageIndex], 
        image: data.imageUrl,
        imageError: false
      };
      setLoadedPages(updatedPages);
      
      toast({
        title: "Success!",
        description: "New illustration created successfully.",
      });
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
      setCurrentPage={setCurrentPage}
    />
  );
};

export default StoryBook;
