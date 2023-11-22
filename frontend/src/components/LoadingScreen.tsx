import Logo from './anim/logo.tsx';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className={'w-screen h-screen flex flex-col justify-center items-center space-y-4'}>
      <div className={"flex flex-col justify-center items-center space-y-4 mb-28"}>
          <Logo className={'w-24 h-24'} />
          <motion.div
              initial='hidden'
              animate='visible'
              variants={textVariants}
              transition={{ duration: 1.8}}
          >
              <h1>Initializing App</h1>
          </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
