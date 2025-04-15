
import { useEffect, useState, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

// Lazy load the form for better initial load times
const StoryForm = lazy(() => import("@/components/StoryForm"));

// Define a simple type for the preferences check
type PreferenceCheck = {
  id: string;
};

const CreateStory = () => {
  const { user } = useAuth();
  const [hasPreferences, setHasPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has saved preferences
  useEffect(() => {
    const checkUserPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Use type assertion to allow accessing user_preferences
        const { data, error } = await supabase
          .from('user_preferences' as any)
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (data && !error) {
          // We know data has an id property if it exists and there's no error
          setHasPreferences(true);
        }
      } catch (error) {
        console.error('Error checking user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserPreferences();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display mb-4 text-legend-blue">
              Create Your Personalized Story
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {user 
                ? hasPreferences 
                  ? "Welcome back! We've loaded your saved story preferences."
                  : "Fill in the details below and save your preferences for next time!"
                : "Fill in the details below to create a one-of-a-kind story starring your child and their favorite things"}
            </p>
          </div>
          
          <Suspense fallback={
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-gray-600">Loading story creation form...</p>
            </div>
          }>
            {!isLoading && <StoryForm />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
