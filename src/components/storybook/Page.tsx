
import React from 'react';
import PageContent from './PageContent';
import PageIllustration from './PageIllustration';

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
    <div className="flex h-full">
      {/* Page content */}
      <div className="flex-1 p-8 overflow-auto flex flex-col justify-between">
        <PageContent 
          content={content}
          isTitlePage={isTitlePage}
          childName={childName}
        />
      </div>
      
      {/* Page illustration */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 relative">
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
