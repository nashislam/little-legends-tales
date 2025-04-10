
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
}

const Page = ({ 
  content, 
  image, 
  imageError, 
  loading, 
  currentPage, 
  isTitlePage,
  childName,
  onRetryImage
}: PageProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full board-book-page">
      {/* Left page - content */}
      <div className={cn(
        "bg-[#FFF9F5] rounded-l-3xl p-8 flex flex-col justify-center shadow-inner",
        "border-r border-[#E6D7CC]"
      )}>
        <PageContent 
          content={content}
          isTitlePage={isTitlePage}
          childName={childName}
        />
      </div>
      
      {/* Right page - illustration */}
      <div className={cn(
        "bg-[#FFF9F5] rounded-r-3xl p-6 flex items-center justify-center shadow-inner",
        "relative overflow-hidden"
      )}>
        <PageIllustration 
          loading={loading}
          imageError={imageError}
          image={image}
          pageNumber={currentPage}
          onRetry={onRetryImage}
        />
      </div>
    </div>
  );
};

export default Page;
