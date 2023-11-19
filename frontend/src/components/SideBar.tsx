import React from 'react';
import { cn } from '../lib/utils.ts';

interface SideBarProps {
  children: React.ReactNode;
  className?: string;
}

const SideBar: React.FC<SideBarProps> = ({ children, className }) => {
  return (
    <div
      className={cn('z-50 left-0 overflow-auto top-0 bottom-0 sticky w-[400px] h-full flex flex-col justify-start items-center border-r border-gray-200 dark:border-gray-700 border-dashed', className)}>
      {children}
    </div>
  );
};
export default SideBar;
