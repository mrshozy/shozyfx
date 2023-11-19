import React from 'react';
import Nav from '../../components/Nav.tsx';
import Body from '../../components/Body.tsx';
import Footer from '../../components/Footer.tsx';
import { NavMenu } from '../nav/SiteNav.tsx';
import Link from '../../components/Link.tsx';
import { Button, buttonVariants } from '../../components/ui/button.tsx';
import ThemeToggle from '../../components/ThemeToggle.tsx';
import Icons from '../../components/Icons.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu.tsx';
import { User } from 'lucide-react';

interface SiteProps {
  children: React.ReactNode;
  className?: string;
  authenticated:boolean;
  logout: () => void
}

export const Site: React.FC<SiteProps> = ({ children, className, authenticated, logout }) => {
  return (
    <div className={'h-screen w-screen flex flex-col space-y-20'}>
      <Nav scrollRef={null}>
        <div className={'w-full h-full flex flex-row justify-start items-center px-10 space-x-3'}>
          <Link href={"/"}> <Icons.logo className={'w-8 h-8'} /> </Link>
          <NavMenu />
          <div className={'w-full h-full flex flex-row justify-end items-center px-3 space-x-3'}>
            {authenticated ?
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className={'focus-visible:ring-transparent'}>
                    <User
                      className='h-[1.2rem] w-[1.2rem]' />
                    <span className='sr-only'>Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className={'focus-visible:ring-transparent'}>
                  <DropdownMenuItem onClick={() => logout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              :
              <>
                <Link className={buttonVariants({ variant: 'outline' })} href={'auth/login'}>Login</Link>
                <Link className={buttonVariants({ variant: 'default' })} href={'auth/register'}>Sign up</Link>
              </>
            }
            <ThemeToggle />
          </div>
        </div>
      </Nav>
      <Body className={className}>
        {children}
      </Body>
      <Footer />
    </div>
  );
};
