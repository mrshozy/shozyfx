import React from 'react';
import Typography from '../../../components/Typography.tsx';
import Layout from '../../../layouts';

interface TermsProps {
  // Define your prop types here
}

const Terms: React.FC<TermsProps> = () => {
  return (
    <Layout social={false} className={'flex flex-col items-center space-y-10 sm:pt-3 md:pt-6 lg:pt-10'}>
      <Typography variant={'h2'} bold>T&C's Page</Typography>
    </Layout>
  );
};

export default Terms;
