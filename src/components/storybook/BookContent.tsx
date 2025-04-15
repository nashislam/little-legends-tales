
import React from 'react';
import Page from './Page';

interface BookContentProps {
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

// Simplified component that directly passes props to Page
const BookContent = (props: BookContentProps) => {
  return <Page {...props} />;
};

export default BookContent;
