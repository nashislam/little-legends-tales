
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
    return null; // Return null for title pages as they'll be handled differently
  }

  return (
    <div className="prose max-w-none font-story text-xl md:text-2xl leading-loose text-[#2D3748] px-8 py-6">
      {formatPageContent(content)}
    </div>
  );
};

export default PageContent;
