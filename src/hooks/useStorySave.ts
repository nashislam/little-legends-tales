
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { type StoryResponse } from '@/lib/openai';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const useStorySave = (storyData: StoryResponse | null, formData: any) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [storySaved, setStorySaved] = useState(false);

  useEffect(() => {
    const checkStorySaved = async () => {
      if (!user || !storyData?.story) return;
      
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('id')
          .eq('user_id', user.id)
          .eq('content', storyData.story)
          .maybeSingle();
        
        if (data) {
          setStorySaved(true);
        }
      } catch (error) {
        console.error('Error checking saved story:', error);
      }
    };
    
    checkStorySaved();
  }, [user, storyData]);

  const handleSaveStory = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or create an account to save your story.",
        variant: "default",
        action: (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        )
      });
      return;
    }

    if (!storyData || !formData) {
      toast({
        title: "Error",
        description: "No story data available to save.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          content: storyData.story,
          child_name: formData?.childName || "",
          child_age: formData?.childAge || "",
          favorite_animal: formData?.favoriteAnimal || "",
          magical_power: formData?.magicalPower || "",
          characters: formData?.characters || "",
          art_style: formData?.artStyle || "",
          structured_content: storyData.pages ? JSON.stringify(storyData) : null,
        });

      if (error) throw error;

      toast({
        title: "Story Saved!",
        description: "Your story has been saved to your account.",
      });
      setStorySaved(true);
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        title: "Failed to Save",
        description: "There was an error saving your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    storySaved,
    handleSaveStory
  };
};
