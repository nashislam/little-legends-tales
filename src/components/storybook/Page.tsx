
import React from 'react';
import PageContent from './PageContent';
import PageIllustration from './PageIllustration';
import { cn } from '@/lib/utils';

interface PageProps {
  content: string;
  image?: string;
  imageError?: boolean;
  loading: boolean;
  currentPage: number;
  isTitlePage: boolean;
  childName: string;
  onRetryImage: (pageIndex: number) => Promise<void>;
  isEvenPage: boolean;
}

const Page = ({ 
  content, 
  image, 
  imageError, 
  loading, 
  currentPage, 
  isTitlePage,
  childName,
  onRetryImage,
  isEvenPage
}: PageProps) => {
  // For title pages, we always want to show the illustration with the title overlay
  if (isTitlePage) {
    return (
      <div className="grid grid-cols-1 h-full board-book-page">
        <div className={cn(
          "bg-[#FFF9F5] rounded-3xl p-6 flex flex-col justify-center shadow-inner",
          "relative overflow-hidden"
        )}>
          <PageIllustration 
            loading={loading}
            imageError={imageError}
            image={image}
            pageNumber={currentPage}
            onRetry={onRetryImage}
            isTitlePage={true}
            childName={childName}
          />
        </div>
      </div>
    );
  }
  
  // Determine the order of content and illustration based on even/odd page
  const contentFirst = isEvenPage;
  
  // Create the book spine/gutter effect
  const Gutter = () => (
    <div className="w-6 bg-gradient-to-r from-[#E6D7CC] to-[#F5F0EA] shadow-inner flex flex-col items-center justify-center">
      <div className="w-[1px] h-2/3 bg-[#0000001a] opacity-30"></div>
    </div>
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] h-full board-book-page">
      {/* Left page - can be content or illustration based on even/odd */}
      <div className={cn(
        "bg-[#FFF9F5] rounded-l-3xl p-6 flex flex-col justify-center shadow-inner",
        "relative overflow-hidden"
      )}>
        {contentFirst ? (
          <PageContent 
            content={content}
            isTitlePage={isTitlePage}
            childName={childName}
          />
        ) : (
          <PageIllustration 
            loading={loading}
            imageError={imageError}
            image={image}
            pageNumber={currentPage}
            onRetry={onRetryImage}
          />
        )}
      </div>
      
      {/* Center gutter/spine */}
      <Gutter />
      
      {/* Right page - can be content or illustration based on even/odd */}
      <div className={cn(
        "bg-[#FFF9F5] rounded-r-3xl p-6 flex flex-col justify-center shadow-inner",
        "relative overflow-hidden"
      )}>
        {contentFirst ? (
          <PageIllustration 
            loading={loading}
            imageError={imageError}
            image={image}
            pageNumber={currentPage}
            onRetry={onRetryImage}
          />
        ) : (
          <PageContent 
            content={content}
            isTitlePage={isTitlePage}
            childName={childName}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
