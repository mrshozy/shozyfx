import React from 'react';
import Typography from './Typography.tsx';
import Icons from './Icons.tsx';

interface FooterProps {
  social: boolean;
}

const Footer: React.FC<FooterProps> = ({ social }) => {
  if (!social) {
    return (
      <footer className={'w-full flex flex-col justify-center items-center'}>
        <Typography variant={'small'} muted>
          © {new Date().getFullYear()} Shozy FX, Inc. All rights reserved.
        </Typography>
      </footer>
    );
  }
  return (
    <footer className={'relative w-full flex flex-col justify-center space-y-5 items-center'}>
      <div className='absolute inset-0 flex items-end mb-10'>
        <span className='w-full border-t' />
      </div>
      <div className={'w-full flex flex-row justify-center items-center'}>
        <div className={'space-x-5 flex flex-row z-50 bg-background px-5'}>
          <a href={'https://www.facebook.com/profile.php?id=100008487093947'} target={'_blank'}>
            <Icons.facebook className={'w-4 h-4 text-primary'} />
          </a>
          <a href={'https://www.instagram.com/zamokuhle_shozi/'} target={'_blank'}>
            <Icons.instagram className={'w-4 h-4 text-primary'} />
          </a>
          <a href={'https://twitter.com/ShoziZamokuhle'} target={'_blank'}>
            <Icons.twitter className={'w-4 h-4 text-primary'} />
          </a>
          <a href={'https://linkedin.com/in/zamokuhle-shozi-877952207'} target={'_blank'}>
            <Icons.linkedin className={'w-4 h-4 text-primary'} />
          </a>
        </div>
        <span />
      </div>
      <Typography variant={'small'} muted>© {new Date().getFullYear()} Shozy FX, Inc. All rights reserved.</Typography>
    </footer>
  );
};

export default Footer;
