
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { FormData } from './FormFields';
import { useToast } from '@/hooks/use-toast';

// Define UserPreference type to match the database structure
type UserPreference = {
  id: string;
  user_id: string;
  child_name: string | null;
  child_age: string | null;
  favorite_animal: string | null;
  preferred_magical_power: string | null;
  favorite_characters: string | null;
  preferred_art_style: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = (initialFormData: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savePreferences, setSavePreferences] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load user preferences on component mount if user is logged in
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;
      
      setLoadingPreferences(true);
      try {
        // Use type assertion to allow accessing user_preferences
        const { data, error } = await supabase
          .from('user_preferences' as any)
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching user preferences:', error);
          return;
        }
        
        if (data && !error) {
          // First convert to unknown then to our type to avoid direct casting errors
          const preferences = data as unknown as UserPreference;
          setFormData({
            childName: preferences.child_name || '',
            childAge: preferences.child_age || '',
            favoriteAnimal: preferences.favorite_animal || '',
            magicalPower: preferences.preferred_magical_power || '',
            characters: preferences.favorite_characters || '',
            artStyle: preferences.preferred_art_style || 'watercolor',
          });
          setSavePreferences(true);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setLoadingPreferences(false);
      }
    };
    
    loadUserPreferences();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveUserPreferences = async () => {
    if (!user) return;
    
    setSavingPreferences(true);
    try {
      // Use type assertion to allow accessing user_preferences
      const { data, error: fetchError } = await supabase
        .from('user_preferences' as any)
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      const preferences = {
        user_id: user.id,
        child_name: formData.childName,
        child_age: formData.childAge,
        favorite_animal: formData.favoriteAnimal,
        preferred_magical_power: formData.magicalPower,
        favorite_characters: formData.characters,
        preferred_art_style: formData.artStyle,
        updated_at: new Date().toISOString(),
      };
      
      let error;
      if (data && !fetchError) {
        // First convert to unknown then to our type to avoid direct casting errors
        const existingPref = data as unknown as { id: string };
        // Update existing preferences using type assertion
        const { error: updateError } = await supabase
          .from('user_preferences' as any)
          .update(preferences)
          .eq('id', existingPref.id);
        error = updateError;
      } else {
        // Insert new preferences using type assertion
        const { error: insertError } = await supabase
          .from('user_preferences' as any)
          .insert([preferences] as any);
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: "Preferences Saved",
        description: "We'll remember your story settings for next time.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Failed to Save",
        description: "We couldn't save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPreferences(false);
    }
  };

  return {
    formData,
    loadingPreferences,
    savingPreferences,
    savePreferences,
    setSavePreferences,
    handleChange,
    handleSelectChange,
    saveUserPreferences
  };
};
