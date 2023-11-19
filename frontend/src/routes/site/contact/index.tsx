import React from 'react';
import Typography from '../../../components/Typography.tsx';
import Layout from '../../../layouts';
interface ContactsProps {
  // Define your prop types here
}

const Contacts: React.FC<ContactsProps> = () => {
  return (
    <Layout className={'flex flex-col items-center space-y-10 sm:pt-3 md:pt-6 lg:pt-10'}>
       <Typography variant={"h2"} bold>Contact Page</Typography>
    </Layout>
  );
};

export default Contacts;