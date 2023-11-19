import React from 'react';
import { useScrollDetection } from '../hooks/useScroll.ts';

interface NavProps {
  children: React.ReactNode
  scrollRef: HTMLDivElement | null
}

const Nav: React.FC<NavProps> = ({children, scrollRef}) => {
  const scrolled = useScrollDetection(scrollRef)
  return (
    <nav className={`h-16 top-0 z-30 w-full fixed ${scrolled && 'border-b'} border-gray-200 dark:border-gray-700 backdrop-blur-lg transition-all`}>
      {children}
    </nav>
  );
};

export default Nav;
