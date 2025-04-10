
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
      <p key={idx} className="mb-8 leading-loose text-left">{paragraph}</p>
    ));
  };

  if (isTitlePage) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl md:text-5xl font-display text-[#5D5FEF] mb-8 leading-tight">
          {childName}'s<br/>Magical<br/>Adventure
        </h1>
        <div className="w-20 h-1 bg-legend-yellow rounded-full my-6"></div>
        <p className="text-2xl font-story text-gray-600 mt-6">A personalized tale of wonder</p>
      </div>
    );
  }

  return (
    <div className="prose max-w-none font-story text-xl md:text-2xl leading-loose text-[#2D3748] px-8 py-6">
      {formatPageContent(content)}
    </div>
  );
};

export default PageContent;
