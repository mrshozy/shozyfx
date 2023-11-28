import React from 'react';
import Typography from '../../components/Typography.tsx';
import Link from '../../components/Link.tsx';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../layouts';

interface Page404Props {
  // Define your prop types here
}

const Page404: React.FC<Page404Props> = () => {

  return (
    <Layout social={false}  className={'flex flex-col justify-center items-center'}>
      <div
        className='max-w-[400px] relative flex h-full flex-col items-center justify-center'>
        <Typography variant={'h1'} bold className={'text-center'}>Page Not Found!</Typography>
        <Typography variant={'p'} muted className={'text-center'}>Sorry, we couldn’t find the page you’re looking for.
          Perhaps you’ve mistyped the URL? Be sure to check your spelling.</Typography>
        <Link href={'/'}
              className={'mt-10 flex justify-center items-center underline underline-offset-2 hover:text-primary text-muted-foreground'}>
          <ArrowLeft className={'w-2 h-2 mr-1'} />
          Return
        </Link>
      </div>
    </Layout>
  );
};

export default Page404;
