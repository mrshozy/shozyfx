import React, { useEffect, useState } from 'react';
import { toast } from '../../components/ui/use-toast';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import Icons from '../../components/Icons';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import * as z from 'zod';
import useRouter from '../../hooks/useRouter.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../components/ui/form.tsx';
import LoadingButton from '../../components/LoadingButton.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';


const formSchema = z.object({
  name: z.string().min(3, 'Invalid name'),
  surname: z.string().min(3, 'Invalid surname'),
  email: z.string().email('Invalid email'),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])[A-Za-z0-9]{8,}/, 'Password must be of length 8 and should contain only latter\'s and digits'),
  cpassword: z.string(),
});
const RegisterForm = ({ disable, setLoading }: { disable: boolean, setLoading: (loading: boolean) => void }) => {
  const { register } = useAuth();
  const { push } = useRouter();
  const [show, setShow] = useState<'password' | 'text'>('password');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      cpassword: '',
      name: '',
      surname: '',
    },
  });
  const { isSubmitting } = form.formState;
  const { setError } = form;
  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting, setLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.cpassword) {
      setError('cpassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    await register(values.name, values.surname, values.email, values.password).then((r) => {
      if (r) {
        push('/auth/login');
      }
    });
  }

  return (
    <Form  {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 w-full'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className={'w-full'}>
              <Label className='sr-only' htmlFor='email'>
                Email
              </Label>
              <FormControl>
                <Input
                  placeholder='Bright'
                  type='name'
                  autoComplete={'name'}
                  disabled={isSubmitting || disable}
                  {...field} />
              </FormControl>
              <FormMessage className={'px-2'} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='surname'
          render={({ field }) => (
            <FormItem className={'w-full'}>
              <Label className='sr-only' htmlFor='email'>
                Email
              </Label>
              <FormControl>
                <Input
                  placeholder='Shozi'
                  type='surname'
                  autoComplete={'surname'}
                  disabled={isSubmitting || disable}
                  {...field} />
              </FormControl>
              <FormMessage className={'px-2'} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className={'w-full'}>
              <Label className='sr-only' htmlFor='email'>
                Email
              </Label>
              <FormControl>
                <Input
                  placeholder='name@unknown.com'
                  type='email'
                  autoComplete={'email'}
                  disabled={isSubmitting || disable}
                  {...field} />
              </FormControl>
              <FormMessage className={'px-2'} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className={'w-full'}>
              <Label className='sr-only' htmlFor='email'>
                Email
              </Label>
              <FormControl>
                <Input
                  placeholder='password'
                  type={show}
                  autoComplete={'new-password'}
                  disabled={isSubmitting || disable}
                  {...field} />
              </FormControl>
              <FormMessage className={'px-2'} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='cpassword'
          render={({ field }) => (
            <FormItem className={'w-full'}>
              <Label className='sr-only' htmlFor='password'>
                Password
              </Label>
              <FormControl>
                <Input
                  placeholder='confirm password'
                  type={show}
                  autoComplete={'new-password'}
                  disabled={isSubmitting || disable}
                  {...field} />
              </FormControl>
              <FormMessage className={'px-2'} />
            </FormItem>
          )}
        />
        <div className='flex items-center space-x-2 my-3'>
          <Checkbox
            onCheckedChange={(checked) => {
              if (checked) {
                setShow('text');
              } else {
                setShow('password');
              }
            }}
            id='showPassword' />
          <label
            htmlFor='showPassword'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground'
          >
            Show Password
          </label>
        </div>
        <LoadingButton loading={isSubmitting} disabled={disable || isSubmitting} className={'w-full'} type='submit'>
          Login
        </LoadingButton>
      </form>
    </Form>
  );
};


interface RegisterProps {
}

const Register: React.FC<RegisterProps> = () => {
  const { authenticated } = useAuth();
  const { push } = useRouter();
  const [isRegisterLoading, setIsRegisterLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  useEffect(() => {
    if (authenticated) {
      push('/');
    }
  }, [authenticated, push]);
  if (authenticated) {
    return <></>;
  }
  return (
    <div className={'h-full w-full'}>
      <div
        className='container relative flex h-full  flex-col items-center mt-16  md:mt-28 justify-start md:flex lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='lg:p-8 w-full flex flex-col justify-center items-center'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Create an account
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email below to create your account
              </p>
            </div>
            <div className={'grid gap-6'}>
              <div className='grid gap-2'>
                <RegisterForm disable={isGoogleLoading} setLoading={(b) => setIsRegisterLoading(b)} />
              </div>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
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
              }} variant='outline' type='button' loading={isGoogleLoading} disabled={isRegisterLoading}>
                <Icons.google className='mr-2 h-4 w-4' />
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
              Already have an account? <br />
              <Link
                to='/auth/login'
                className='underline underline-offset-4 hover:text-primary'
              >Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
