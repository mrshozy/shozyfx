import React, {createContext, useEffect, useMemo, useState} from 'react';
import User from '../@types/auth';
import LoadingScreen from '../components/LoadingScreen';
import {axiosInstance} from '../libs/utils';
import {toast} from '../components/ui/use-toast';
import useStorage from "../hooks/useStorage";
import {jwtDecode} from 'jwt-decode';
import {ToastAction} from "@radix-ui/react-toast";

const AuthContext = createContext<ContextType | undefined>(undefined);

interface ContextType {
    user?: User;
    init: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, surname: string, email: string, password: string) => Promise<boolean>;
    authenticated: boolean;
    logout: () => void
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [init, setInit] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<User | undefined>();
    const [token, setToken] = useStorage<null | string>("token", null);
    const [exp, setExp] = useState<number | null>();
    function clearSession() {
        setToken(null);
        delete axiosInstance.defaults.headers.common.Authorization;
        localStorage.removeItem("token");
    }

    const decodeToken = (token: string) => {
        const {id, name, surname, email, exp} = jwtDecode<any>(token)
        return {id, name, surname, email, exp};
    };

    useEffect(() => {
        setTimeout(() => {
            setAuthenticated(!!token);
            setInit(true);
        }, 1500);
    }, []);

    useEffect(() => {
        if (exp) {
            const currentTime = Math.floor(Date.now()); // Convert to seconds
            if (exp < currentTime) {
                clearSession();
                window.location.href = '/auth/login';
            } else {
                axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
                setAuthenticated(true)
                const timeLeft = Math.ceil((new Date(exp).getTime() - currentTime));
                setTimeout(() => {
                    clearSession();
                    window.location.href = '/auth/login';
                }, timeLeft)
            }
        }
    }, [exp]);

    useEffect(() => {
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) {
                localStorage.setItem("token", JSON.stringify(token))
                const {id, name, surname, email, exp}: any = decodedToken;
                setUser({id, name, surname, email});
                setExp(exp);
            } else {
                clearSession();
            }
        } else {
            clearSession();
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        return await axiosInstance.post("auth/login", {email, password})
            .then(resp => resp.data)
            .then(json => {
                if (!json.success) {
                    toast({
                        title: 'Login failed',
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
                    title: 'Login failed',
                    variant: 'destructive',
                    description: e.message ? e.message : 'An unexpected error occurred',
                });
                return false;
            });
    };

    const register = async (name: string, surname: string, email: string, password: string) => {
        return await axiosInstance.post("auth/register", {
            email,
            password,
            surname,
            name
        }).then(r => r.data).then(json => {
                if (!json.success) {
                    toast({
                        title: "Sign up confirmation",
                        variant: "destructive",
                        description: "Account created successful please login on the login page",
                    })
                    return false
                }
                toast({
                    title: "Sign up confirmation",
                    variant: "default",
                    description: json.message,
                })
                return true
            }
        ).catch(e => {
            toast({
                title: "Sign up Error",
                variant: "destructive",
                description: e.message || "Unknown error occurred while trying to community with the server",
                action: e.message == null ?
                    <ToastAction onClick={() => register(name, surname, email, password,)} altText="Try again">Try again</ToastAction> : undefined
            })
            return false
        })
    }
    const logout = () => {
        setToken(null)
        setAuthenticated(false)
    }
    const contextValue = useMemo(() => {
        return {init, login, user, authenticated, register, logout};
    }, [init, login, user, authenticated, register, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {init ? children : <LoadingScreen/>}
        </AuthContext.Provider>
    );
};

export {AuthProvider, AuthContext};