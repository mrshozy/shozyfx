import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const LazyLoad = () => {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    return () => {
      NProgress.done();
    };
  });
  return '';
};

export default LazyLoad