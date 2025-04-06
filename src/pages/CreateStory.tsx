
import Navbar from "@/components/Navbar";
import StoryForm from "@/components/StoryForm";

const CreateStory = () => {
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
              Fill in the details below to create a one-of-a-kind story starring your child and their favorite things
            </p>
          </div>
          
          <StoryForm />
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
