import React from 'react';
import { cn } from '../lib/utils.ts';

interface BodyProps {
  children:React.ReactNode
  className?: string
}

const Body: React.FC<BodyProps> = ({children, className}) => {
  return (
    <div className={cn("grow w-full", className)}>
      {children}
    </div>
  );
};

export default Body;
