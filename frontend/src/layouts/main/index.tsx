import React from 'react';
import Nav from "./nav";
import {cn} from "../../libs/utils";

interface MainLayoutProps {
    children: React.ReactNode,
    className?: string
}

const MainLayout: React.FC<MainLayoutProps> = ({children, className}) => {
  return (
      <main className={"flex flex-col w-full h-screen"}>
          <Nav/>
          <div className={cn("grow", className)}>
              {children}
          </div>
          <footer className={"w-full flex justify-center items-center text-muted-foreground text-sm"}>
              <p>© 2023 Shozy FX, Inc. All rights reserved.</p>
          </footer>
      </main>
  );
};

export default MainLayout;
