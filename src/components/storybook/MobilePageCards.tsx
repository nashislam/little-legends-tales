
import React from 'react';
import MobilePageCard from './MobilePageCard';

interface MobilePageCardsProps {
  page: {
    content: string;
    image?: string;
    imageError?: boolean;
  };
  index: number;
  currentPage: number;
  childName: string;
  loading: boolean;
  onRetryImage: (pageIndex: number) => Promise<void>;
}

const MobilePageCards = ({
  page,
  index,
  currentPage,
  childName,
  loading,
  onRetryImage
}: MobilePageCardsProps) => {
  return (
    <MobilePageCard
      page={page}
      index={index}
      currentPage={currentPage}
      childName={childName}
      loading={loading}
      onRetryImage={onRetryImage}
    />
  );
};

export default MobilePageCards;
