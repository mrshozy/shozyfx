import React from 'react';
import Typography from '../../../components/Typography.tsx';
import Layout from '../../../layouts';

interface PricesProps {
  // Define your prop types here
}

const Prices: React.FC<PricesProps> = () => {
  return (
    <Layout className={'flex flex-col items-center space-y-10 sm:pt-3 md:pt-6 lg:pt-10'}>
      <Typography variant={"h2"} bold>Prices Page</Typography>
    </Layout>
  );
};

export default Prices;
