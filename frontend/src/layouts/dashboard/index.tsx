"use client"
import * as React from 'react';
import {Sidebar} from "./SideBar";
import {Toolbar} from "./nav";
import {ScrollArea} from "../../components/ui/scroll-area";
import {Separator} from "../../components/ui/separator";
import useAuth from "../../hooks/useAuth";
import {cn} from "../../libs/utils";




type Props = {
    children: React.ReactNode,
    pageTitle: string
    className?: string
    fixed?:boolean
};


export function Dashboard({children, pageTitle, className, fixed}: Props) {
    const {authenticated} = useAuth();
    if(!authenticated){
        window.location.href = "/auth/login"
        return <></>
    }
    return (
        <main className={`flex flex-row min-h-full h-screen min-w-full overflow-hidden ${fixed && "fixed"}`}>
            <ScrollArea className="justify-start supports-backdrop-blur:bg-background/60 sticky right-0 top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className={"flex flex-row "}>
                    <Sidebar className="overflow-auto h-full hidden lg:block w-80" pageTitle={pageTitle}/>
                    <Separator orientation="vertical" className={"w-1 my-4"}/>
                </div>
            </ScrollArea>
            <div className={"flex flex-col min-h-full w-full h-screen mt-1 grow overflow-hidden"}>
                <Toolbar className={"justify-start lg:ml-2 lg:mx-8 supports-backdrop-blur:bg-background/60 sticky top-0 z-50 min-w-full w-full border-b bg-background/95 backdrop-blur"}>
                    <Sidebar className="w-80 h-full block" pageTitle={pageTitle}/>
                </Toolbar>
                <div className={cn("lg:ml-2 grow h-full w-full lg:p-4 pr-1 overflow-auto", className)}>
                    {children}
                </div>
            </div>
        </main>
    );
}