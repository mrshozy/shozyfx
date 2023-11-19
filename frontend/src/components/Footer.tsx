import React from 'react';
import Typography from './Typography.tsx';

interface FooterProps {
  // Define your prop types here
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className={"w-full h-10 flex flex-col justify-center items-center"}>
      <Typography variant={"small"} muted>© {new Date().getFullYear()} Shozy FX, Inc. All rights reserved.</Typography>
    </footer>
  );
};

export default Footer;
