import React, {useEffect, useState} from "react";

const useStorage = <T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(key);
        if (!stored) {
            return defaultValue;
        } else {
            return JSON.parse(stored) as T;
        }
    });
    useEffect(() => {
        if (value == null) window.localStorage.removeItem(key)
        else window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value, defaultValue]);
    return [value, setValue];
};

export default useStorage;