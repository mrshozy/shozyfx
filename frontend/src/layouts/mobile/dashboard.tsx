import React, { useEffect } from 'react';
import Nav from '../../components/Nav.tsx';
import Footer from '../../components/Footer.tsx';
import Body from '../../components/Body.tsx';
import useRouter from '../../hooks/useRouter.ts';
import useAuth from '../../hooks/useAuth.ts';
import { cn } from '../../lib/utils.ts';

interface DashboardProps {
  children: React.ReactNode;
  className?: string;
  showNavBar?: boolean;
  social: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ children, className, social }) => {
  const { push } = useRouter();
  const { authenticated } = useAuth();
  useEffect(() => {
    if (!authenticated) {
      push('/auth/login');
    }
  }, [authenticated, push]);
  if (!authenticated) {
    return <></>;
  }
  return (
    <div className={'h-screen w-screen flex flex-col'}>
      <Nav scrollRef={null}>
      </Nav>
      <Body className={cn('', className)}>
        {children}
      </Body>
      <Footer social={social} />
    </div>
  );
};