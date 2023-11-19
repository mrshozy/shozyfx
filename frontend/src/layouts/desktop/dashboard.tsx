import React, { useEffect, useRef } from 'react';
import Nav from '../../components/Nav.tsx';
import Footer from '../../components/Footer.tsx';
import Body from '../../components/Body.tsx';
import SideBar from '../../components/SideBar.tsx';
import { cn } from '../../lib/utils.ts';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.tsx';
import useAuth from '../../hooks/useAuth.ts';
import { Card } from '../../components/ui/card.tsx';
import SideBarNav from '../../components/SideBarNav.tsx';
import Icons from '../../components/Icons.tsx';
import Typography from '../../components/Typography.tsx';
import {
  NavigationMenu,
  NavigationMenuItem, NavigationMenuList,
  NavigationMenuTrigger
} from "../../components/ui/navigation-menu";
import { SearchDialog } from '../../components/SearchDialog.tsx';
import { Button } from '../../components/ui/button.tsx';
import { useTheme } from '../../hooks/useTheme.ts';
import useRouter from '../../hooks/useRouter.ts';
import Link from '../../components/Link.tsx';

const navigation = [
  {
    title: 'Overview',
    children: [
      {
        href: '/dashboard',
        title: 'Dashboard',
        icon: <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-4 w-4'>
          <rect width='7' height='7' x='3' y='3' rx='1' />
          <rect width='7' height='7' x='14' y='3' rx='1' />
          <rect width='7' height='7' x='14' y='14' rx='1' />
          <rect width='7' height='7' x='3' y='14' rx='1' />
        </svg>,
      },
      {
        href: '/dashboard/charts',
        title: 'Charts',
        icon: <svg
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          viewBox='0 0 24 24'
          className='mr-2 h-4 w-4'>
          <path d='M9 5v4' />
          <path d='M8 9 H10 A1 1 0 0 1 11 10 V14 A1 1 0 0 1 10 15 H8 A1 1 0 0 1 7 14 V10 A1 1 0 0 1 8 9 z' />
          <path d='M9 15v2M17 3v2' />
          <path d='M16 5 H18 A1 1 0 0 1 19 6 V12 A1 1 0 0 1 18 13 H16 A1 1 0 0 1 15 12 V6 A1 1 0 0 1 16 5 z' />
          <path d='M17 13v3M3 3v18h18' />
        </svg>,
      },
      {
        href: '/dashboard/signals',
        title: 'Signals',
        icon: <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-4 w-4'
        >
          <path d='M4.9 19.1C1 15.2 1 8.8 4.9 4.9' />
          <path d='M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5' />
          <circle cx='12' cy='12' r='2' />
          <path d='M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5' />
          <path d='M19.1 4.9C23 8.8 23 15.1 19.1 19' />
        </svg>,
      },
      {
        href: '/dashboard/calender',
        title: 'Calender',
        icon: <svg
          viewBox='0 0 24 24'
          fill='currentColor'
          height='1em'
          width='1em'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-4 w-4'>
          <path
            d='M19 4h-2V3a1 1 0 00-2 0v1H9V3a1 1 0 00-2 0v1H5a3 3 0 00-3 3v12a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm1 15a1 1 0 01-1 1H5a1 1 0 01-1-1v-7h16zm0-9H4V7a1 1 0 011-1h2v1a1 1 0 002 0V6h6v1a1 1 0 002 0V6h2a1 1 0 011 1z' />
        </svg>,
      },
    ],
  },
  {
    title: "Settings",
    children: [

    ]
  }
];

interface DashboardProps {
  children: React.ReactNode;
  className?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ children, className }) => {
  const { user, authenticated } = useAuth()
  const {push} = useRouter()
  const [open, setOpen] = React.useState(false)
  const node = useRef<HTMLDivElement>(null);
  const {theme, setTheme} = useTheme();
  useEffect(() => {
    if (!authenticated){
      push('/auth/login');
    }
  }, [authenticated, push]);
  if (!authenticated){
    return <></>
  }
  return (
    <div className={'h-screen w-screen flex flex-row fixed'}>
      <SideBar className={'space-y-2 pt-2 flex flex-col justify-start items-start'}>
        <Link href={"/"} className={"w-full p-4 flex flex-row justify-start items-center space-x-3"}>
          <Icons.logo className={"w-8 h-8"} />
          <Typography variant={"h3"}>ShozyFx</Typography>
        </Link>
        <Card className='space-y-4 p-4 ml-3 w-[285px]'>
          <div className='flex w-full h-full'>
            <div className='flex w-full items-center space-x-4'>
              <Avatar>
                <AvatarImage src={''} />
                <AvatarFallback>{`${user?.name.charAt(0)}${user?.surname.charAt(0)}`.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-medium leading-none'>{`${user?.name} ${user?.surname}`}</p>
                <p className='text-sm text-muted-foreground'>{user?.email}</p>
              </div>
            </div>
          </div>
        </Card>
        <SideBarNav navigations={navigation} />
      </SideBar>
      <Body className={'flex flex-row grow p-0'}>
        <div className={cn('grow h-full flex flex-col', className)}>
          <Nav scrollRef={node.current}>
            <NavigationMenu className={"space-x-3 ml-6"}>
              <NavigationMenuItem className={"list-none h-16 flex flex-row justify-start items-center"}>
                <NavigationMenuList>
                  <NavigationMenuTrigger className={"lg:hidden"}>
                    <svg
                      fill="none" viewBox="0 0 15 15" height="1em" width="1em"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M1.5 3a.5.5 0 000 1h12a.5.5 0 000-1h-12zM1 7.5a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </NavigationMenuTrigger>
                  {/*<NavigationMenuContent className={cn("w-72")}>*/}
                  {/*  {props.children}*/}
                  {/*</NavigationMenuContent>*/}
                  <NavigationMenuItem>
                    <Button size={"icon"} variant={"ghost"} onClick={()=>setOpen(true)}>
                      <Icons.search className="h-4 w-4" />
                    </Button>
                    <SearchDialog open={open} setOpen={setOpen}/>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button size={"icon"} variant={"ghost"} onClick={()=> setTheme(theme == "light" ? "dark" : "light")}>
                      {theme == "light" ? <Icons.dark_mode className="h-4 w-4"/> : <Icons.light_mode className="h-4 w-4"/>}
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuItem>
            </NavigationMenu>
          </Nav>
          <div ref={node} className={"flex grow pt-16 overflow-auto"}>
            {children}
          </div>
          <Footer />
        </div>
      </Body>
    </div>
  );
};
