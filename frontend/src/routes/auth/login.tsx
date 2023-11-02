import React, {useState} from 'react';
import Layout from "../../layouts";
import {Button} from "../../components/ui/button";
import Icons from '../../components/Icons';
import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import {Link} from "react-router-dom";

interface LoginProps {
    // Define your prop types here
}

const Login: React.FC<LoginProps> = () => {
    const [isSignupLoading, setIsSignupLoading] = React.useState<boolean>(false)
    const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsSignupLoading(true)
        setTimeout(() => {
            setIsSignupLoading(false)
        }, 1000)
    }
    return (
        <Layout title={"Login"}>

            <div className="container relative flex h-full flex-col items-center justify-center md:flex lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="lg:p-8 w-full flex flex-col justify-center items-center">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Login
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email and password below to sign in on your account
                            </p>
                        </div>
                        <div className={"grid gap-6"}>
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-2">
                                    <div className="grid gap-1">
                                        <Label className="sr-only" htmlFor="email">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isSignupLoading || isGoogleLoading}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }}
                                        />
                                        <Input
                                            id="password"
                                            placeholder="password"
                                            type="password"
                                            autoCapitalize="none"
                                            autoCorrect="off"
                                            disabled={isSignupLoading || isGoogleLoading}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <Button disabled={isSignupLoading || isGoogleLoading}>
                                        {isSignupLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Sign In
                                    </Button>
                                </div>
                            </form>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                  <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                  </span>
                                </div>
                            </div>
                            <Button variant="outline" type="button" disabled={isSignupLoading || isGoogleLoading}>
                                {isGoogleLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Icons.google className="mr-2 h-4 w-4" />
                                )}{" "}
                                Google
                            </Button>
                        </div>
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{" "}
                            <Link
                                to="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                to="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Login;
