import React from 'react';
import { Link as DomLink } from 'react-router-dom';
import { cn } from '../lib/utils.ts';

interface LinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ href, className, children }) => {
  return (
    <DomLink className={cn(className)} to={href}>
      {children}
    </DomLink>
  );
};

export default Link;
