// import React from 'react';
// import { cn } from '../lib/utils.ts';
//
// interface TypographyProps {
//   variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'large' | 'lead' | 'blockquote';
//   bold?: boolean;
//   muted?: boolean;
//   className?: string;
//   children: React.ReactNode;
// }
//
// const Typography: React.FC<TypographyProps> = ({ className, variant, bold, muted, children }) => {
//   className = cn(`${bold && 'font-extrabold'} ${muted && ' text-muted-foreground'}`, className);
//   switch (variant) {
//     case 'h1': {
//       return (
//         <h1
//           className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)}>
//           {children}
//         </h1>
//       );
//     }
//     case 'h2': {
//       return (
//         <h2
//           className={cn('scroll-m-20 pb-2 text-3xl font-semibold tracking-tight', className.replace('font-extrabold', ''))}>
//           {children}
//         </h2>
//       );
//     }
//     case 'h3': {
//       return (
//         <h3
//           className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className.replace('font-extrabold', ''))}>
//           {children}
//         </h3>
//       );
//     }
//     case 'h4': {
//       return (
//         <h4
//           className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className.replace('font-extrabold', ''))}>
//           {children}
//         </h4>
//       );
//     }
//     case 'p': {
//       return (
//         <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>{children}</p>
//       );
//     }
//     case 'small': {
//       return (
//         <small className={cn('text-sm font-medium leading-none', className)}>{children}</small>
//       );
//     }
//     case 'large': {
//       return (
//         <div className={cn('text-lg font-semibold', className)}>Are you sure absolutely sure?</div>
//       );
//     }
//     case 'lead' : {
//       return (
//         <p className={cn('text-xl text-muted-foreground', className)}>{children}</p>
//       );
//     }
//     case 'blockquote': {
//       return (
//         <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)}> {children}</blockquote>
//       );
//     }
//     default: {
//       return (<p className={cn(className)}>{children}</p>);
//     }
//   }
// };
//
// export default Typography;

import React from 'react';
import { cn } from '../lib/utils.ts';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'large' | 'lead' | 'blockquote';
  bold?: boolean;
  muted?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  small: 'text-sm font-medium leading-none',
  large: 'text-lg font-semibold',
  lead: 'text-xl text-muted-foreground',
  blockquote: 'mt-6 border-l-2 pl-6 italic',
};

const Typography: React.FC<TypographyProps> =
  ({
     className = '',
     variant,
     bold,
     muted,
     children,
   }) => {
    const baseStyles = cn(`${bold && 'font-extrabold'} ${muted && 'text-muted-foreground'}`, className);
    const specificStyles = variantStyles[variant!] || '';

    const Tag = variant || 'p';

    return React.createElement(
      Tag,
      { className: cn(baseStyles, specificStyles) },
      children,
    );
  };

export default Typography;
