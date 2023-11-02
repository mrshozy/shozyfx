import React from 'react';
import MaxWidthPageWrapper from '../../components/MaxWidthPageWrapper';
import {Link} from "react-router-dom";
import {buttonVariants} from "../../components/ui/button";
import Icons from '../../components/Icons';
import ThemeToggle from "../../components/ThemeToggle";
import {NavMenu} from "../../components/NavMenu";

interface NavProps {
  // Define your prop types here
}

const Nav: React.FC<NavProps> = () => {
    return (
        <nav className='sticky h-16 inset-x-0 top-0 z-30 w-full border-b border-gray-200 dark:border-gray-700 backdrop-blur-lg transition-all'>
            <MaxWidthPageWrapper>
                <div className='flex h-16 items-center justify-between border-b border-zinc-200 dark:border-gray-700 '>
                    <div className={"flex flex-row space-x-1.5 items-center justify-center"}>
                        <Icons.stock className={"w-8 h-8"} />
                        <Link
                            to='/'
                            className='flex z-40 font-semibold'>
                            <span>Shozy FX.</span>
                        </Link>
                        <NavMenu/>
                    </div>
                    <div className='hidden items-center space-x-4 sm:flex'>
                        <Link className={buttonVariants({variant: "ghost"})} to={"/auth/login"}>Login</Link>
                        <Link className={buttonVariants()} to={"/auth/signup"}>Get Started
                            <Icons.login className="ml-2 h-4 w-4" />
                        </Link>
                        <ThemeToggle/>
                    </div>
                </div>
            </MaxWidthPageWrapper>
        </nav>
    );
};

export default Nav;
