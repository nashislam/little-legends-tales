
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const exampleStories = [
  { title: "Shay's Enchanted Garden", image: "/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png" },
  { title: "Nyla's Dino Adventure", image: "/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png" },
  { title: "Dillon's Birthday Surprise", image: "/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png" },
  { title: "Noam's Bedtime Journey", image: "/lovable-uploads/390b8016-b246-4925-8265-8571a9a2969a.png" },
];

const BookCarousel = () => {
  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {exampleStories.map((story, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-2">
              <Card className="border-2 border-purple-200 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="mt-3 text-lg font-display text-purple-900 text-center">
                    {story.title}
                  </h3>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default BookCarousel;
