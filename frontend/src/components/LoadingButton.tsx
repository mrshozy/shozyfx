import React from 'react';
import {Button, buttonVariants} from "./ui/button";
import type {VariantProps} from "class-variance-authority";
import Icons from './Icons';

interface LoadingButtonProps extends  VariantProps<typeof buttonVariants>, React.ButtonHTMLAttributes<HTMLButtonElement>{
  loading: boolean
}

const LoadingButton: React.FC<LoadingButtonProps> = ({loading, children, ...props}) => {
  return (
    <Button disabled={loading} {...props}>
        {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : children }
    </Button>
  );
};

export default LoadingButton;
