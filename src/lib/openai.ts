
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type StoryParams = {
  childName: string;
  childAge: string;
  favoriteAnimal: string;
  magicalPower: string;
  characters: string;
  artStyle: string;
};

export interface StoryResponse {
  story: string;
  pages: Array<{
    pageNumber: number;
    content: string;
    imagePrompt: string;
  }>;
  coverPrompt: string;
  backCoverPrompt: string;
}

export const generateStory = async (params: StoryParams): Promise<StoryResponse> => {
  try {
    console.log("Generating story with parameters:", params);
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-story', {
      body: params,
    });

    if (error) {
      console.error('Error calling generate-story function:', error);
      throw new Error('Failed to generate story. Please try again.');
    }

    if (!data?.pages || !data?.coverPrompt) {
      console.error('Invalid response format returned:', data);
      throw new Error('Invalid story format generated. Please try again.');
    }

    console.log('Story successfully generated with structured content');
    return data;
  } catch (error) {
    console.error('Error in generateStory function:', error);
    throw error;
  }
};
