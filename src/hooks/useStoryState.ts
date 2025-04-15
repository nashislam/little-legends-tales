
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type StoryResponse } from '@/lib/openai';

export interface PageData {
  content: string;
  image?: string;
  imagePrompt?: string;
  imageError?: boolean;
  pageNumber: number;
}

export const useStoryState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState<StoryResponse | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [storyPages, setStoryPages] = useState<PageData[]>([]);

  useEffect(() => {
    if (location.state?.pages || location.state?.story) {
      // Handle both new format and legacy format
      const data = location.state;
      setFormData(location.state.formData);
      
      if (data.pages) {
        // New format with structured pages
        setStoryData(data);
        
        // Convert the structured pages to our display format
        const allPages: PageData[] = [
          {
            pageNumber: 0,
            content: "Cover Page",
            imagePrompt: data.coverPrompt,
          }
        ];
        
        // Add content pages
        data.pages.forEach((page: any) => {
          allPages.push({
            pageNumber: page.pageNumber,
            content: page.content,
            imagePrompt: page.imagePrompt,
          });
        });
        
        // Add back cover
        if (data.backCoverPrompt) {
          allPages.push({
            pageNumber: allPages.length,
            content: "Back Cover",
            imagePrompt: data.backCoverPrompt,
          });
        }
        
        setStoryPages(allPages);
      } else {
        // Legacy format with just story text
        const storyText = data.story;
        const pages = [];
        
        // Add title page
        pages.push({
          pageNumber: 0,
          content: "Title Page",
        });
        
        // Split the story by paragraphs and create pages
        const paragraphs = storyText.split('\n\n').filter((p: string) => p.trim() !== '');
        const paragraphsPerPage = 2;
        
        for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
          const pageContent = paragraphs.slice(i, i + paragraphsPerPage).join('\n\n');
          pages.push({
            pageNumber: pages.length,
            content: pageContent,
          });
        }
        
        setStoryPages(pages);
      }
    } else {
      navigate("/create");
    }
  }, [location.state, navigate]);

  return {
    storyData,
    formData,
    storyPages,
  };
};
