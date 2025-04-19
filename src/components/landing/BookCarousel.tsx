
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const exampleStories = [
  { title: "Shay's Enchanted Garden", image: "/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png" },
  { title: "Nyla's Dino Adventure", image: "/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png" },
  { title: "Dillon's Birthday Surprise", image: "/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png" },
  { title: "Noam's Bedtime Journey", image: "/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png" },
];

const BookCarousel = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center text-white">Popular Stories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exampleStories.map((story, index) => (
          <Link key={index} to="/create" className="block transform hover:scale-105 transition-transform duration-300">
            <Card className="story-card border-2 border-purple-cloud/20 overflow-hidden h-full">
              <div className="aspect-square relative">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-serif text-gray-800 text-center">
                  {story.title}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookCarousel;
