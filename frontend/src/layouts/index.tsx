import React, {useEffect} from 'react';
import MainLayout from "./main";
import {Dashboard} from "./dashboard";

interface LayoutProps {
    children: React.ReactNode
    isDashboard?:boolean
    title:string
    className?:string
    fixed?:boolean
}

const Layout: React.FC<LayoutProps> = ({children, isDashboard, fixed, title, className}) => {
    useEffect(()=>{
        document.title = `ShozyFX | ${title}`
    }, [title])
    if (isDashboard){
        return <Dashboard pageTitle={title} fixed={fixed} >{children}</Dashboard>
    }
    return (
        <MainLayout className={className}>
            {children}
        </MainLayout>
    );
};

export default Layout;
