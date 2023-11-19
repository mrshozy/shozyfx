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
}

const Layout: React.FC<LayoutProps> = ({ children, dashboard, className }) => {
  const { device } = useSettings();
  const {authenticated, logout} = useAuth()
  if (device == 'mobile') {
    if (dashboard) {
      return (
        <MobileDashboard className={className}>
          {children}
        </MobileDashboard>
      );
    }
    return (
      <MobileSite className={className}>
        {children}
      </MobileSite>
    );
  }
  if (dashboard) {
    return (
      <DesktopDashboard className={className}>
        {children}
      </DesktopDashboard>
    );
  }
  return (
    <DesktopSite className={className} logout={logout} authenticated={authenticated}>
      {children}
    </DesktopSite>
  );
};

export default Layout;
