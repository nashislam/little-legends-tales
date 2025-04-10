
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Book, Eye, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  child_name: string;
  art_style: string;
  created_at: string;
  content: string;
}

const MySavedStories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from('stories' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setStories(data || []);
      } catch (error) {
        console.error('Error fetching stories:', error);
        toast({
          title: 'Error fetching stories',
          description: 'Failed to load your saved stories.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [user, navigate, toast]);

  const handleViewStory = (story: Story) => {
    // Prepare data in the same format as when creating a story
    navigate('/preview', {
      state: {
        story: story.content,
        formData: {
          childName: story.child_name,
          artStyle: story.art_style,
        },
      },
    });
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stories' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove the story from the state
      setStories(stories.filter(story => story.id !== id));

      toast({
        title: 'Story deleted',
        description: 'Your story has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the story.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display mb-4 text-legend-blue">
              My Saved Stories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View and manage all the magical stories you've created
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg">Loading your stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Book size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No stories yet</h2>
              <p className="text-gray-500 mb-6">
                You haven't created any stories yet. Let's make some magic!
              </p>
              <Button onClick={() => navigate('/create')}>Create Your First Story</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map(story => (
                <div
                  key={story.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={cn(
                    "h-4 w-full",
                    story.art_style === 'watercolor' && "bg-blue-300",
                    story.art_style === 'cartoon' && "bg-green-300",
                    story.art_style === 'dreamy' && "bg-purple-300",
                    story.art_style === 'pixel' && "bg-yellow-300",
                    story.art_style === 'comic' && "bg-red-300",
                    story.art_style === 'storybook' && "bg-teal-300",
                  )}></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {story.child_name}'s Adventure
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Created on {formatDate(story.created_at)}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleViewStory(story)}
                      >
                        <Eye size={16} />
                        View Story
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteStory(story.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySavedStories;
