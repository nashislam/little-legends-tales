
import { supabase } from '@/integrations/supabase/client';

type StoryParams = {
  childName: string;
  childAge: string;
  favoriteAnimal: string;
  magicalPower: string;
  characters: string;
  artStyle: string;
};

export const generateStory = async (params: StoryParams): Promise<string> => {
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

    if (!data?.story) {
      throw new Error('No story generated. Please try again.');
    }

    return data.story;
  } catch (error) {
    console.error('Error in generateStory function:', error);
    throw error;
  }
};
