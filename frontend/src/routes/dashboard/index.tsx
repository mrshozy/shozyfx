import React from 'react';
import Layout from '../../layouts';

interface DashboardLayoutProps {
  children:React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({children}) => {

  return (
    <Layout dashboard>
      {children}
    </Layout>
  );
};

export default DashboardLayout;
