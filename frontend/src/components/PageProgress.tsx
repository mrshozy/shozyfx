import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Import NProgress styles

const NProgressWrapper = () => {
  useEffect(() => {
    alert("here")
    const start = () => NProgress.start;
    const done = () => NProgress.done();

    // Set up listeners for the global events
    window.addEventListener('load', done);
    window.addEventListener('beforeunload', start);

    // Clean up listeners on component unmount
    return () => {
      window.removeEventListener('load', done);
      window.removeEventListener('beforeunload', start);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default NProgressWrapper;
