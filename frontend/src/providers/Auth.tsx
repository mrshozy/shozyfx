import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import User from '../@types/auth';
import LoadingScreen from '../components/LoadingScreen';
import { axiosInstance } from '../lib/utils';
import { toast } from '../components/ui/use-toast';
import useStorage from '../hooks/useLocalStorage.ts';
import { jwtDecode } from 'jwt-decode';
import { ToastAction } from '@radix-ui/react-toast';
import { buttonVariants } from '../components/ui/button.tsx';

const AuthContext = createContext<ContextType | undefined>(undefined);

interface ContextType {
  user?: User;
  init: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, surname: string, email: string, password: string) => Promise<boolean>;
  requestResetPassword: (email: string) => Promise<boolean>;
  resetPassword: (password: string, token: string) => Promise<boolean>;
  authenticated: boolean;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const decodeToken = (token: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { id, name, surname, email, exp } = jwtDecode(token);
  return { id, name, surname, email, exp };
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [init, setInit] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useStorage<null | string>('token', null);
  const [timeoutId, setTimeOutId] = useState<NodeJS.Timeout | undefined>();


  const clearSession = useCallback(() => {
    setAuthenticated(false);
    delete axiosInstance.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
    setToken(null);
  }, [setToken]);


  const setSessions = useCallback((token: string) => {
    const currentTime = Math.floor(Date.now());
    const { id, name, surname, email, exp } = decodeToken(token);
    setUser({ id, name, surname, email });
    clearInterval(timeoutId);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    setAuthenticated(true);
    const timeLeft = Math.ceil((new Date(exp || 0).getTime() - currentTime));
    setTimeOutId(
      setTimeout(() => {
        clearSession();
        window.location.href = '/auth/login';
      }, timeLeft),
    );
  }, [clearSession]);

  const resumeSession = useCallback(() => {
    if (token) {
      setSessions(token);
    } else {
      clearSession();
    }
    setInit(true);
  }, [clearSession, setSessions, token]);

  useEffect(() => {
    setTimeout(() => {
      resumeSession();
    }, 2200);
  }, [resumeSession]);

  useEffect(() => {
    if (init && token != null && !authenticated) {
      setSessions(token);
    }
  }, [authenticated, init, setSessions, token]);

  const login = useCallback(async (email: string, password: string) => {
    return await axiosInstance.post('auth/login', { email, password })
      .then(resp => resp.data)
      .then(json => {
        if (!json.success) {
          toast({
            title: 'Login',
            variant: 'destructive',
            description: json.message,
          });
          return false;
        }
        setToken(json.body);
        return true;
      })
      .catch(e => {
        toast({
          title: 'Login',
          variant: 'destructive',
          description: e.message ? e.message : 'An unexpected error occurred',
        });
        return false;
      });
  }, [setToken]);

  const register = useCallback(async (name: string, surname: string, email: string, password: string) => {
    return await axiosInstance.post('auth/register', {
      email,
      password,
      surname,
      name,
    }).then(r => r.data).then(json => {
        if (!json.success) {
          toast({
            title: 'Sign up',
            variant: 'destructive',
            description: json.message,
          });
          return false;
        }
        toast({
          title: 'Sign up',
          variant: 'default',
          description: 'Account created successful please login on the login page',
        });
        return true;
      },
    ).catch(e => {
      toast({
        title: 'Sign up',
        variant: 'destructive',
        description: e.message || 'Unknown error occurred while trying to community with the server',
        action: e.message == null ?
          <ToastAction
            className={buttonVariants({ variant: 'ghost' })}
            onClick={() => register(name, surname, email, password)}
            altText='Retry'>Retry</ToastAction> : undefined,
      });
      return false;
    });
  }, []);
  const resetPassword = useCallback(async (password: string, token: string) => {
    return await axiosInstance.post(`auth/reset-password/${token}`, { password }).then(r => r.data).then(json => {
      if (!json.success) {
        toast({
          title: 'Reset password',
          variant: 'destructive',
          description: json.message,
        });
        return false;
      }
      toast({
        title: 'Reset password',
        variant: 'default',
        description: json.message,
      });
      return true;
    }).catch(e => {
      toast({
        title: 'Reset password',
        variant: 'destructive',
        description: e.message || 'Unknown error occurred while trying to community with the server',
        action: e.message == null ?
          <ToastAction
            className={buttonVariants({ variant: 'ghost' })}
            onClick={() => resetPassword(password, token)}
            altText='Retry'>Retry</ToastAction> : undefined,
      });
      return false;
    });
  }, []);
  const requestResetPassword = useCallback(async (email: string) => {
    return await axiosInstance.post('auth/request-reset-password', { email }).then(r => r.data).then(json => {
      if (!json.success) {
        toast({
          title: 'Reset password',
          variant: 'destructive',
          description: json.message,
        });
        return false;
      }
      toast({
        title: 'Reset password',
        variant: 'default',
        description: json.message,
      });
      return true;
    }).catch(e => {
      toast({
        title: 'Reset password',
        variant: 'destructive',
        description: e.message || 'Unknown error occurred while trying to community with the server',
        action: e.message == null ?
          <ToastAction
            className={buttonVariants({ variant: 'ghost' })}
            onClick={() => requestResetPassword(email)}
            altText='Retry'>Retry</ToastAction> : undefined,
      });
      return false;
    });
  }, []);


  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const contextValue = useMemo(() => {
    return { init, login, user, authenticated, register, logout, resetPassword, requestResetPassword };
  }, [authenticated, init, login, logout, register, user, resetPassword, requestResetPassword]);

  return (
    <AuthContext.Provider value={contextValue}>
      {init ? children : <LoadingScreen />}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };