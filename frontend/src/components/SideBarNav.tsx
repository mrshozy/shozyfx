import React from 'react';
import { Button } from './ui/button.tsx';
import useRouter from '../hooks/useRouter.ts';
import usePathname from '../hooks/usePath.ts';
import Typography from './Typography.tsx';

interface List {
  onClick?: (href: string) => void,
  title: string,
  children: {
    href: string,
    title: string,
    icon: React.ReactElement
  }[]
}

const List = ({ title, children, onClick }: List) => {
  const path = usePathname();
  return (
    <div className='px-3 py-2'>
      <Typography variant={"p"} className='mb-2 font-semibold tracking-tight text-muted-foreground'>
        {title}
      </Typography>
      <div className='space-y-1'>
        {children.map(({ title, href, icon }) => (
          <Button
            key={title} onClick={() => onClick && onClick(href)}
            variant={path.endsWith(href) ? 'secondary' : 'ghost'}
            className={`w-full h-12 justify-start ${path.endsWith(href) ? "dark:text-primary" : "text-muted-foreground"}`}>
            {icon}
            {title}
          </Button>
        ))}
      </div>
    </div>
  );
};
interface SideBarContainerProps {
  navigations: List[];
}

const SideBarNav: React.FC<SideBarContainerProps> = ({ navigations }) => {
  const { push } = useRouter();
  return (
    <div className={'w-full flex flex-col'}>
      {navigations.map((n, i) => (
        <List onClick={(href) => push(href)} key={i} title={n.title} children={n.children} />
      ))}
    </div>
  );
};

export default SideBarNav;