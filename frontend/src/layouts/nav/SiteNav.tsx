import { cn } from '../../lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../../components/ui/navigation-menu';
import { NavFeatures } from './data.ts';
import { buttonVariants } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import React from 'react';


export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList className={'text-muted-foreground w-full'}>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(buttonVariants({ variant: 'ghost' }), 'focus-visible:ring-transparent')}>Features</NavigationMenuTrigger>
          <NavigationMenuContent className={'focus-visible:ring-transparent dark:border-gray-700'}>
            <ul
              className='z-50 grid w-full min-w-[18rem] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] focus-visible:ring-transparent'>
              {NavFeatures.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className={'hidden sm:flex'}>
          <Link to='/prices'>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Prices
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className={'hidden sm:flex'}>
          <Link to='/contacts'>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contacts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={href || '/'}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = 'ListItem';