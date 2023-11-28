import React, {useEffect} from 'react';
import Icons from '../../components/Icons';
import {Label} from '../../components/ui/label';
import {Input} from '../../components/ui/input';
import {Link} from 'react-router-dom';
import useAuth from '../../hooks/useAuth.ts';
import {toast} from '../../components/ui/use-toast.ts';
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormMessage} from '../../components/ui/form.tsx';
import LoadingButton from '../../components/LoadingButton.tsx';
import useRouter from '../../hooks/useRouter.ts';
import Layout from "../../layouts";


const formSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().regex(/^(?=.*[A-Z])[A-Za-z0-9]{8,}/, 'Invalid password'),
});
const LoginForm = ({disable, setLoading}: { disable: boolean, setLoading: (loading: boolean) => void }) => {
    const {login} = useAuth();
    const {push} = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const {isSubmitting} = form.formState;

    useEffect(() => {
        setLoading(isSubmitting);
    }, [isSubmitting, setLoading]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await login(values.email, values.password).then((r) => {
            if (r) {
                setTimeout(() => {
                    push('/');
                }, 500);
            }
        });
    }

    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 w-full'>
                <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                        <FormItem className={'w-full'}>
                            <Label className='sr-only' htmlFor='email'>
                                Email
                            </Label>
                            <FormControl>
                                <Input
                                    placeholder='name@unknown.com'
                                    type='email'
                                    autoComplete={'username'}
                                    disabled={isSubmitting || disable}
                                    {...field} />
                            </FormControl>
                            <FormMessage className={'px-2'}/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({field}) => (
                        <FormItem className={'w-full'}>
                            <Label className='sr-only' htmlFor='password'>
                                Password
                            </Label>
                            <FormControl>
                                <Input
                                    placeholder='password'
                                    type='password'
                                    autoComplete={'current-password'}
                                    disabled={isSubmitting || disable}
                                    {...field} />
                            </FormControl>
                            <FormMessage className={'px-2'}/>
                        </FormItem>
                    )}
                />
                <LoadingButton loading={isSubmitting} disabled={disable || isSubmitting} className={'w-full'}
                               type='submit'>
                    Login
                </LoadingButton>
            </form>
        </Form>
    );
};


interface LoginProps {
    // Define your prop types here
}

const Login: React.FC<LoginProps> = () => {
    const {authenticated} = useAuth();
    const {push} = useRouter();
    const [isSignupLoading, setIsSignupLoading] = React.useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
    useEffect(() => {
        if (authenticated) {
            push('/');
        }
    }, [authenticated, push]);
    if (authenticated) {
        return <></>
    }
    return (
        <Layout social={false}  className={'grow'}>
            <div
                className='container relative flex h-full flex-col items-center justify-start md:flex lg:max-w-none lg:grid-cols-2 lg:px-0'>
                <div className='lg:p-8 w-full flex flex-col justify-center items-center'>
                    <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                        <div className='flex flex-col space-y-2 text-center'>
                            <h1 className='text-2xl font-semibold tracking-tight'>
                                Login
                            </h1>
                            <p className='text-sm text-muted-foreground'>
                                Enter your email and password below to sign in on your account
                            </p>
                        </div>
                        <div className={'grid gap-6'}>
                            <div className='grid gap-2'>
                                <LoginForm setLoading={(bo) => setIsSignupLoading(bo)} disable={isGoogleLoading}/>
                                <p
                                    className={'px-0 text-end text-sm text-muted-foreground'}>
                                    <Link
                                        to='/auth/reset-password'
                                        className='underline underline-offset-4 hover:text-primary'
                                    >
                                        Forgot Password?
                                    </Link>
                                </p>
                            </div>
                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center'>
                                    <span className='w-full border-t'/>
                                </div>
                                <div
                                    className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>
                      Or continue with
                    </span>
                                </div>
                            </div>
                            <LoadingButton onClick={() => {
                                setIsGoogleLoading(true);
                                setTimeout(() => {
                                    setIsGoogleLoading(false);
                                    toast({
                                        variant: 'default',
                                        title: 'Login',
                                        description: 'Google login is not yet supported',
                                    });
                                }, 1000);
                            }} variant='outline' type='button' loading={isGoogleLoading} disabled={isSignupLoading}>
                                <Icons.google className='mr-2 h-4 w-4'/>
                                {' '}
                                Google
                            </LoadingButton>
                        </div>
                        <p className='px-8 text-center text-sm text-muted-foreground'>
                            By clicking continue, you agree to our{' '}
                            <Link
                                to='/terms'
                                className='underline underline-offset-4 hover:text-primary'
                            >
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link
                                to='/privacy'
                                className='underline underline-offset-4 hover:text-primary'
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                        <p className={'px-8 text-center text-sm text-muted-foreground'}>
                            New User? <br/>
                            <Link
                                to='/auth/register'
                                className='underline underline-offset-4 hover:text-primary'
                            >Create an Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Login;