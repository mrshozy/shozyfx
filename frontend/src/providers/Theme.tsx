import React, {createContext, useEffect} from "react"
import useStorage from "../hooks/useStorage";

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({children, defaultTheme = "dark", storageKey = "theme", ...props}: ThemeProviderProps) {
    const [theme, setTheme] = useStorage(storageKey, defaultTheme)

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            root.classList.add(systemTheme)
            return
        }
        root.classList.add(theme)
    }, [theme])

    return (
        <ThemeProviderContext.Provider {...props} value={{theme,
                setTheme: (theme: Theme) => setTheme(theme)}}>
            {children}
        </ThemeProviderContext.Provider>
    )
}