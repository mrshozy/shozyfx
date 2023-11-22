import React from 'react';
import useSettings from '../hooks/useSettings.ts';
import { Dashboard as MobileDashboard } from './mobile/dashboard.tsx';
import { Site as MobileSite } from './mobile/site.tsx';
import { Dashboard as DesktopDashboard } from './desktop/dashboard.tsx';
import { Site as DesktopSite } from './desktop/site.tsx';
import useAuth from '../hooks/useAuth.ts';

interface LayoutProps {
  children: React.ReactNode;
  dashboard?: boolean;
  className?: string;
  showNavBar?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, dashboard, className, showNavBar }) => {
  const { device } = useSettings();
  const {authenticated, logout} = useAuth()
  if (device == 'mobile') {
    if (dashboard) {
      return (
        <MobileDashboard className={className} showNavBar={showNavBar}>
          {children}
        </MobileDashboard>
      );
    }
    return (
      <MobileSite className={className} showNavBar={showNavBar}>
        {children}
      </MobileSite>
    );
  }
  if (dashboard) {
    return (
      <DesktopDashboard className={className} showNavBar={showNavBar}>
        {children}
      </DesktopDashboard>
    );
  }
  return (
    <DesktopSite className={className} logout={logout} authenticated={authenticated} showNavBar={showNavBar}>
      {children}
    </DesktopSite>
  );
};

export default Layout;
