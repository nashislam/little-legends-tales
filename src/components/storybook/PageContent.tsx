
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
      <p key={idx} className="mb-5 leading-relaxed">{paragraph}</p>
    ));
  };

  if (isTitlePage) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-display text-[#5D5FEF] mb-6 leading-tight">
          {childName}'s<br/>Magical<br/>Adventure
        </h1>
        <div className="w-16 h-1 bg-legend-yellow rounded-full my-4"></div>
        <p className="text-xl font-story text-gray-600 mt-4">A personalized tale of wonder</p>
      </div>
    );
  }

  return (
    <div className="prose max-w-none font-story text-xl md:text-2xl leading-relaxed text-[#2D3748]">
      {formatPageContent(content)}
    </div>
  );
};

export default PageContent;
