import React, {createContext, useEffect} from "react"
import useLocalStorage from "../hooks/useLocalStorage.ts";

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

interface ThemeContextProps {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeContextProps | undefined>(undefined)

function ThemeProvider({children, defaultTheme = "light", storageKey = "vite-ui-theme", ...props}: ThemeProviderProps) {
    const [theme, setTheme] = useLocalStorage(storageKey, defaultTheme)
    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            return
        }
        root.classList.add(theme)
    }, [theme])

    return (
        <ThemeProviderContext.Provider {...props} value={{
            theme,
            setTheme: (theme: Theme) => {
                localStorage.setItem(storageKey, theme)
                setTheme(theme)
            }
        }}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export {ThemeProviderContext, ThemeProvider}