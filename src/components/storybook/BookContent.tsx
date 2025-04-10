
import React from 'react';
import { cn } from '@/lib/utils';
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

const BookContent = ({
  content,
  image,
  imageError,
  loading,
  currentPage,
  isTitlePage,
  childName,
  onRetryImage,
  isEvenPage
}: BookContentProps) => {
  return (
    <Page
      content={content}
      image={image}
      imageError={imageError}
      loading={loading}
      currentPage={currentPage}
      isTitlePage={isTitlePage}
      childName={childName}
      onRetryImage={onRetryImage}
      isEvenPage={isEvenPage}
    />
  );
};

export default BookContent;
