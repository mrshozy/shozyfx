import React, {useEffect} from 'react';
import Typography from '../../components/Typography.tsx';
import {Input} from '../../components/ui/input.tsx';
import Link from '../../components/Link.tsx';
import {ArrowLeft} from 'lucide-react';
import {useLocation} from 'react-router-dom';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '../../components/ui/form.tsx';
import LoadingButton from '../../components/LoadingButton.tsx';
import useAuth from '../../hooks/useAuth.ts';
import useRouter from '../../hooks/useRouter.ts';
import Layout from '../../layouts/index.tsx';

interface ResetProps {

}

const formSchema = z.object({
    email: z.string().email('Invalid email'),
});

const RequestResetForm = () => {
    const {requestResetPassword} = useAuth();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });
    const {isSubmitting} = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await requestResetPassword(values.email)
    }

    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                        <FormItem className={'w-full'}>
                            <FormControl>
                                <Input placeholder='name@unknown.com'
                                       autoCapitalize='none'
                                       autoComplete='email'
                                       autoCorrect='off'
                                       disabled={isSubmitting}
                                       {...field} />
                            </FormControl>
                            <FormMessage className={'px-2'}/>
                        </FormItem>
                    )}
                />
                <LoadingButton loading={isSubmitting} className={'w-full'} type='submit'>Send Request</LoadingButton>
            </form>
        </Form>
    );
};

const passwordSchema = z.object({
    password: z.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])[A-Za-z0-9]{8,}/, 'Password must be of length 8 and should contain only latter\'s and digits'),
    cpassword: z.string(),
});
const ResetForm = ({token}: { token: string }) => {
    const {resetPassword} = useAuth();
    const {push} = useRouter();
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            cpassword: '',
        },
    });
    const {isSubmitting} = form.formState;
    const {setError} = form;

    async function onSubmit(values: z.infer<typeof passwordSchema>) {
        if (values.password !== values.cpassword) {
            setError('cpassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }
        await resetPassword(values.password, token).then(r => {
            if (r) {
                setTimeout(() => {
                    push('/auth/login');
                }, 1500);
            }
        });
    }

    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <FormField
                    control={form.control}
                    name='password'
                    render={({field}) => (
                        <FormItem className={'w-full'}>
                            <FormControl>
                                <Input
                                    placeholder='password'
                                    type='password'
                                    disabled={isSubmitting}
                                    {...field} />
                            </FormControl>
                            <FormMessage className={'px-2'}/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='cpassword'
                    render={({field}) => (
                        <FormItem className={'w-full'}>
                            <FormControl>
                                <Input
                                    placeholder='confirm password'
                                    type='password'
                                    disabled={isSubmitting}
                                    {...field} />
                            </FormControl>
                            <FormMessage className={'px-2'}/>
                        </FormItem>
                    )}
                />
                <LoadingButton loading={isSubmitting} className={'w-full'} type='submit'>
                    Reset Password
                </LoadingButton>
            </form>
        </Form>
    );
};


const Reset: React.FC<ResetProps> = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('t');
    const {push} = useRouter();
    const {authenticated} = useAuth();
    useEffect(() => {
        if (authenticated) {
            push('/');
        }
    }, [authenticated, push]);
    if (authenticated) {
        return <></>
    }
    if (token) {
        return (
            <Layout className={'h-full w-full flex justify-center flex-col items-center'}>
                <div
                    className='container max-w-[400px] space-y-4 h-full flex-col items-center mt-4  lg:mt-16 justify-start '>
                    <img width={80} className={'w-24 h-24'} src={'/password-reset.png'} alt={'lock'}/>
                    <Typography className={'text-center'} variant={'h2'}>Enter new password</Typography>
                    <Typography variant={'p'} muted className={'text-center'}>
                        Please enter the new password associated with your account to reset the password of your
                        account.
                    </Typography>
                    <ResetForm token={token}/>
                    <Link href={'/auth/login'}
                          className={'flex justify-center items-center underline underline-offset-2 hover:text-primary text-muted-foreground'}>
                        <ArrowLeft className={'w-2 h-2 mr-1'}/>
                        Return to login
                    </Link>
                </div>
            </Layout>
        );
    }
    return (
        <Layout className={'h-full w-full flex justify-center flex-col items-center'}>
            <div
                className='container max-w-[400px]  space-y-4 flex h-full flex-col items-center mt-4 lg:mt-16 justify-start'>
                <img width={80} className={'w-24 h-24'} src={'/password-reset.png'} alt={'lock'}/>
                <Typography variant={'h2'}>Forgot your password?</Typography>
                <Typography variant={'p'} muted className={'text-center'}>
                    Please enter the email address associated with your account and We will email you a link to reset
                    your
                    password.
                </Typography>
                <RequestResetForm/>
                <Link href={'/auth/login'}
                      className={'flex justify-center items-center underline underline-offset-2 hover:text-primary text-muted-foreground'}>
                    <ArrowLeft className={'w-2 h-2 mr-1'}/>
                    Return to login
                </Link>
            </div>
        </Layout>
    );
};

export default Reset;
