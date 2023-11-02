import React from 'react';
import {buttonVariants} from "../../components/ui/button";
import Layout from "../../layouts";
import {Link} from "react-router-dom";

interface HomeProps {

}

const Home: React.FC<HomeProps> = () => {
    return (
        <Layout title={"Home"} className={"flex flex-col items-center space-y-10 pt-10"}>
            <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
                <p className='text-sm font-semibold'>
                    <span className={"font-bold h-8"}>SHOZY FX</span> start trading with AI assistance
                </p>
            </div>
            <p className={'max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl text-center'}>Trade Fast, Accurately, and Efficient with AI</p>
            <p className={"text-muted-foreground text-center"}>Dive into future of trading with us, transitioning from traditional trading to a more innovative, efficient, and streamlined approach</p>
            <Link to={"/auth/signup"} className={buttonVariants()}>Get Started</Link>
            <p className={"text-muted-foreground text-center space-x-4"}>TRUSTED BY MANY</p>
        </Layout>
    );
};
export default Home;