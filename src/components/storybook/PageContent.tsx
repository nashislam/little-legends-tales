
import React from 'react';

interface PageContentProps {
  content: string;
  isTitlePage: boolean;
  childName: string;
}

const PageContent = ({ content, isTitlePage, childName }: PageContentProps) => {
  // Format page content with line breaks and proper spacing
  const formatPageContent = (content: string) => {
    if (!content) return null;
    
    // Split content by paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((paragraph, idx) => (
      <p key={idx} className="mb-4">{paragraph}</p>
    ));
  };

  if (isTitlePage) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-display text-legend-blue mb-6">
          {childName}'s Magical Adventure
        </h1>
        <p className="text-xl font-story text-gray-600 mb-4">A personalized tale of wonder</p>
        <p className="font-story text-lg text-gray-500 mt-8">Written just for {childName}</p>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none font-story leading-relaxed text-lg">
      {formatPageContent(content)}
    </div>
  );
};

export default PageContent;
