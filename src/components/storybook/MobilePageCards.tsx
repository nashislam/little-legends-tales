
import React, { useEffect } from 'react';
import MobilePageCard from './MobilePageCard';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import { type UseEmblaCarouselType } from 'embla-carousel-react';

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
        onSelect={(api: UseEmblaCarouselType[1]) => {
          if (api) {
            const selectedIndex = api.selectedScrollSnap();
            if (selectedIndex !== currentPage) {
              setCurrentPage(selectedIndex);
            }
          }
        }}
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
        
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-white/80" />
          <CarouselNext className="right-4 bg-white/80" />
        </div>
      </Carousel>
    </>
  );
};

export default MobilePageCards;
