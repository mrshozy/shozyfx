import React, {useEffect} from 'react';
import Nav from '../../components/Nav.tsx';
import Footer from '../../components/Footer.tsx';
import Body from '../../components/Body.tsx';
import useRouter from '../../hooks/useRouter.ts';
import useAuth from '../../hooks/useAuth.ts';

interface DashboardProps {
    children: React.ReactNode;
    className?: string;
    showNavBar?: boolean
}

export const Dashboard: React.FC<DashboardProps> = ({children, className}) => {
    const {push} = useRouter();
    const {authenticated} = useAuth();
    useEffect(() => {
        if (!authenticated) {
            push('/auth/login');
        }
    }, [authenticated, push]);
    if (!authenticated) {
        return <></>;
    }
    return (
        <div className={'h-screen w-screen flex flex-col space-y-20'}>
            <Nav scrollRef={null}>
            </Nav>
            <Body className={className}>
                {children}
            </Body>
            <Footer/>
        </div>
    );
};