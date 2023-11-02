import React from 'react';
import {cn} from "../libs/utils";

interface MaxWidthPageWrapperProps {
    children:React.ReactNode,
    className?: string;
}

const MaxWidthPageWrapper: React.FC<MaxWidthPageWrapperProps> = ({children, className}) => {
  return (
      <div className={cn('mx-auto w-full px-4', className)}>
        {children}
      </div>
  );
};

export default MaxWidthPageWrapper;
