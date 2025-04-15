
import React, { useEffect } from 'react';
import MobilePageCard from './MobilePageCard';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobilePageCardsProps {
  pages: Array<{
    content: string;
    image?: string;
    imageError?: boolean;
  }>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  childName: string;
  loading: boolean[];
  onRetryImage: (pageIndex: number) => Promise<void>;
}

const MobilePageCards = ({
  pages,
  currentPage,
  setCurrentPage,
  childName,
  loading,
  onRetryImage
}: MobilePageCardsProps) => {
  const isMobile = useIsMobile();
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  // Navigate to the selected page when currentPage prop changes
  React.useEffect(() => {
    if (!api) return;
    api.scrollTo(currentPage);
  }, [api, currentPage]);

  // Handle page announcement for accessibility
  useEffect(() => {
    if (!isMobile) return;
    
    // For accessibility, announce page changes
    const announcePageChange = () => {
      const pageAnnouncer = document.getElementById('page-announcer');
      if (pageAnnouncer) {
        pageAnnouncer.textContent = `Page ${currentPage + 1} of ${pages.length}`;
      }
    };
    
    announcePageChange();
  }, [currentPage, pages.length, isMobile]);

  const handlePrevPage = () => {
    if (api && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (api && currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {/* Visually hidden announcer for screen readers */}
      <div 
        id="page-announcer" 
        className="sr-only" 
        aria-live="polite"
      ></div>
      
      <Carousel
        className="w-full overflow-visible touch-pan-y"
        opts={{
          align: "center",
          loop: false,
          startIndex: currentPage,
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {pages.map((page, index) => (
            <CarouselItem 
              key={index} 
              className="pl-2 md:pl-4 min-w-0 basis-full sm:basis-9/10 md:basis-4/5 lg:basis-3/4"
            >
              <MobilePageCard
                page={page}
                index={index}
                currentPage={currentPage}
                childName={childName}
                loading={loading[index]}
                onRetryImage={() => onRetryImage(index)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Desktop navigation arrows - hidden on mobile */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-white/80" />
          <CarouselNext className="right-4 bg-white/80" />
        </div>
      </Carousel>
      
      {/* Mobile-specific navigation buttons - shown at bottom of screen */}
      <div className="flex justify-center mt-6 gap-4 md:hidden">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border border-gray-300 bg-white/90"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border border-gray-300 bg-white/90"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default MobilePageCards;
