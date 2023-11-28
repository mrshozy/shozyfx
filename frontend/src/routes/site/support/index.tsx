import React from 'react';
import Typography from '../../../components/Typography.tsx';
import Layout from '../../../layouts';

interface SupportProps {
  // Define your prop types here
}

const Support: React.FC<SupportProps> = () => {
  return (
    <Layout social={false}  className={'flex flex-col items-center space-y-10 sm:pt-3 md:pt-6 lg:pt-10'}>
      <Typography variant={"h2"} bold>Support Page</Typography>
    </Layout>
  );
};

export default Support;
