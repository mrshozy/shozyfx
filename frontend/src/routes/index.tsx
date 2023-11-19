import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from './dashboard';
import Reset from './auth/Reset.tsx';
import Contact from './site/contact';
import LazyLoad from '../components/LazyLoad.tsx';

export const Home = lazy(() => import('./site'));
export const Contacts = lazy(() => import('./site/contact'));
export const Prices = lazy(() => import('./site/prices'));
export const Privacy = lazy(() => import('./site/privacy'));
export const Support = lazy(() => import('./site/support'));
export const Terms = lazy(() => import('./site/terms'));
export const Login = lazy(() => import('./auth/Login'));
export const Register = lazy(() => import('./auth/Register'));
export const Dashboard = lazy(() => import('./dashboard/app'));
export const Charts = lazy(() => import('./dashboard/charts'));
export const Signals = lazy(() => import('./dashboard/signals'));
export const Calender = lazy(() => import('./dashboard/calender'));
export const Page404 = lazy(() => import('./404'));


export default function Router() {
  return useRoutes([
    {
      path: 'dashboard',
      element: (
        <DashboardLayout>
          <Suspense fallback={<LazyLoad />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <Dashboard />, index: true },
        { element: <Charts />, path: 'charts' },
        { element: <Signals />, path: 'signals' },
        { element: <Calender />, path: 'calender' },
      ],
    },
    {
      index: true,
      element: <Home />,
    },
    {
      path: 'auth/login',
      element: <Login />,
    },
    {
      path: 'auth/register',
      element: <Register />,
    },
    {
      path: 'auth/reset-password',
      element: <Reset />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: 'contacts',
      element: <Contact />,
    },
    {
      path: 'prices',
      element: <Prices />,
    },
    {
      path: 'privacy',
      element: <Privacy />,
    },
    {
      path: 'terms',
      element: <Terms />,
    },
    {
      path: 'support',
      element: <Support />,
    },
    {
      path: '*',
      element: <Navigate to='/404' replace />,
    },
  ]);
}