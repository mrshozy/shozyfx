import React, {useEffect, useState} from "react";

const useStorage = <T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>, () => void] => {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(key);
        if (!stored) {
            return defaultValue;
        } else {
            return JSON.parse(stored) as T;
        }
    });

    const reset = () => {
        setValue(defaultValue);
    };

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== JSON.stringify(value)) {
                localStorage.removeItem(key)
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, value]);

    useEffect(() => {
        if (value === defaultValue){
            window.localStorage.removeItem(key)
        }else{
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value, defaultValue]);
    return [value, setValue, reset];
};

export default useStorage;
