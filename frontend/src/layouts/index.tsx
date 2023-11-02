import React, {useEffect} from 'react';
import MainLayout from "./main";

interface LayoutProps {
    children: React.ReactNode
    isDashboard?:boolean
    title:string
    className?:string
}

const Layout: React.FC<LayoutProps> = ({children, isDashboard, title, className}) => {
    useEffect(()=>{
        document.title = `ShozyFX | ${title}`
    }, [title])
    return (
        <MainLayout className={className}>
            {children}
        </MainLayout>
    );
};

export default Layout;
