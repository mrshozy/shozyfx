import React from 'react';
import { buttonVariants } from '../../components/ui/button.tsx';
import Typography from '../../components/Typography.tsx';
import Link from '../../components/Link.tsx';
import Layout from '../../layouts';
import useAuth from '../../hooks/useAuth.ts';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const {authenticated} = useAuth();
  return (
    <Layout showNavBar className={'flex flex-col items-center space-y-10 sm:pt-3 md:pt-6 lg:pt-10'}>
      <div
        className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
        <Typography className='text-sm font-semibold text-center'>
          <span className={'font-bold h-8'}>SHOZY FX</span> start trading with AI assistance
        </Typography>
      </div>
      <p
        className={'max-w-4xl text-4xl font-bold md:text-6xl lg:text-7xl text-center px-5'}>
        Trade Fast, Accurately, and Efficient with AI
      </p>
      <Typography
        muted
        className={'text-center px-5'}>
        Dive into future of trading with us, transitioning from traditional trading to a more innovative, efficient, and
        streamlined approach
      </Typography>
      <Link href={authenticated ? "/dashboard": '/auth/register'} className={buttonVariants()}>{authenticated ? "Visit Dashboard" : "Get Started"}</Link>
      <Typography muted className={'text-center space-x-4'}>TRUSTED BY MANY</Typography>
    </Layout>
  );
};

export default Home;
