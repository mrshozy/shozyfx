import React, {useState} from 'react';
import Nav from '../../components/Nav.tsx';
import Body from '../../components/Body.tsx';
import Footer from '../../components/Footer.tsx';
import {NavMenu} from '../nav/SiteNav.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {User, Menu} from 'lucide-react';
import {Button, buttonVariants} from '../../components/ui/button.tsx';
import useRouter from '../../hooks/useRouter.ts';
import {cn} from '../../lib/utils.ts';
import ThemeToggle from '../../components/ThemeToggle.tsx';
import Icons from '../../components/Icons.tsx';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../../components/ui/sheet';
import Link from '../../components/Link.tsx';
import usePathname from '../../hooks/usePath.ts';
import useAuth from '../../hooks/useAuth.ts';

interface SiteProps {
    children: React.ReactNode;
    className?: string;
    showNavBar?: boolean
}

export const Site: React.FC<SiteProps> = ({children, className, showNavBar}) => {
    const {push} = useRouter();
    const {logout, authenticated} = useAuth();
    const path = usePathname();
    const [open, setOpen] = useState(false);
    return (
        <div className={'h-screen w-screen flex flex-col space-y-20'}>
            <Nav scrollRef={null}>
                <div className={'w-full h-full flex flex-row justify-start items-center px-3 space-x-3'}>
                    <Link href={"/"}><Icons.logo className={'w-8 h-8'}/></Link>
                    {
                        showNavBar && (
                            <>
                                <NavMenu/>
                                <div className={'fixed right-3 flex flex-row justify-start items-center space-x-3'}>
                                    <DropdownMenu open={open} onOpenChange={setOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='icon'>
                                                <User className='h-[1.2rem] w-[1.2rem]'/>
                                                <span className='sr-only'>Account</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            {authenticated ?
                                                <DropdownMenuItem onClick={() => logout()}>
                                                    Logout
                                                </DropdownMenuItem>
                                                :
                                                <>
                                                    <DropdownMenuItem onClick={() => push('/auth/register')}>
                                                        Register
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => push('/auth/login')}>
                                                        Login
                                                    </DropdownMenuItem>
                                                </>
                                            }

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <ThemeToggle/>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant='ghost' size='icon' className={'sm:hidden flex'}>
                                                <Menu className='h-[1.2rem] w-[1.2rem]'/>
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side={'left'}
                                                      className={'flex flex-col justify-start focus:border-none'}>
                                            <SheetHeader
                                                className={'w-full flex flex-row text-center space-x-2 justify-start items-start'}>
                                                <Icons.logo className={'w-5 h-5 mt-3'}/>
                                                <SheetTitle>ShozyFX</SheetTitle>
                                            </SheetHeader>
                                            <div className='flex flex-col space-y-3'>
                                                <Link href={'/'}
                                                      className={cn(buttonVariants({variant: path == '/' ? 'secondary' : 'ghost'}), 'w-full flex justify-start h-12')}>
                                                    Home
                                                </Link>
                                                <Link href={'/prices'}
                                                      className={cn(buttonVariants({variant: path == '/prices' ? 'secondary' : 'ghost'}), 'w-full flex justify-start h-12')}>
                                                    Prices
                                                </Link>
                                                <Link href={'/contacts'}
                                                      className={cn(buttonVariants({variant: path == '/contacts' ? 'secondary' : 'ghost'}), 'w-full flex justify-start h-12')}>
                                                    contacts
                                                </Link>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </>
                        )
                    }
                </div>
            </Nav>
            <Body className={className}>
                {children}
            </Body>
            <Footer/>
        </div>
    );
};
