import React from 'react';
import Icons from "./Icons";
interface LoadingScreenProps {

}

const LoadingScreen: React.FC<LoadingScreenProps> = () => {
  return (
    <div className={"w-screen h-screen flex flex-col justify-center items-center space-y-2"}>
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        <p>Initializing App</p>
    </div>
  );
};

export default LoadingScreen;
